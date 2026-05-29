/**
 * Predictive Scoring API
 *
 * Provides ML-based conversion predictions for leads.
 * Protected by admin authentication.
 *
 * GET /api/admin/predictions?profile_id=xxx - Get prediction for a lead
 * GET /api/admin/predictions?action=batch - Get predictions for all qualified leads
 * POST /api/admin/predictions/train - Trigger model training (future)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getPredictionResult,
  getEnhancedScore,
  getBatchPredictions,
  extractFeatures,
  savePrediction,
  getActiveModel,
  trainModel,
  setActiveModel,
  predict,
} from "@/lib/analytics/predictive-scoring";
import { createServiceClient } from "@/lib/supabase/server";
import type { LeadProfile } from "@/types/lead-intelligence-v2";
import type { TrainingDataPoint, ModelAccuracyMetrics, ConfusionMatrix } from "@/types/predictive";

// ============================================
// API HANDLERS
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const profileId = searchParams.get("profile_id");

    const supabase = await createServiceClient();

    // Single profile prediction
    if (profileId) {
      const { data: profile, error } = await supabase
        .from("lead_profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error || !profile) {
        return NextResponse.json(
          { error: "Lead profile not found" },
          { status: 404 }
        );
      }

      const prediction = getPredictionResult(profile as LeadProfile);
      const enhancedScore = getEnhancedScore(profile as LeadProfile);
      const features = extractFeatures(profile as LeadProfile);

      // Save prediction to history
      await savePrediction(profileId, prediction, features);

      return NextResponse.json({
        prediction,
        enhanced_score: enhancedScore,
        features,
      });
    }

    // Batch predictions
    if (action === "batch") {
      const limit = parseInt(searchParams.get("limit") ?? "100", 10);
      const minScore = parseInt(searchParams.get("min_score") ?? "0", 10);

      const { data: profiles, error } = await supabase
        .from("lead_profiles")
        .select("*")
        .gte("composite_score", minScore)
        .order("composite_score", { ascending: false })
        .limit(limit);

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch profiles" },
          { status: 500 }
        );
      }

      const batchResults = getBatchPredictions(profiles as LeadProfile[]);

      return NextResponse.json(batchResults);
    }

    // Model info
    if (action === "model") {
      const model = getActiveModel();
      return NextResponse.json({
        version: model.version,
        trained_at: model.trained_at,
        feature_count: Object.keys(model.weights).length,
        features: Object.keys(model.weights),
      });
    }

    // Top predictions
    if (action === "top") {
      const limit = parseInt(searchParams.get("limit") ?? "20", 10);

      // Get recent predictions
      const { data: predictions } = await supabase
        .from("prediction_history")
        .select(`
          *,
          lead_profiles (
            id,
            canonical_email,
            first_name,
            last_name,
            company,
            journey_stage,
            priority_tier,
            composite_score
          )
        `)
        .order("predicted_value", { ascending: false })
        .limit(limit);

      return NextResponse.json({
        predictions: predictions ?? [],
      });
    }

    // Default: prediction stats
    const { data: recentPredictions } = await supabase
      .from("prediction_history")
      .select("predicted_value, confidence")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const stats = {
      total_predictions_24h: recentPredictions?.length ?? 0,
      avg_probability: recentPredictions?.length
        ? recentPredictions.reduce((sum, p) => sum + (p.predicted_value as number), 0) / recentPredictions.length
        : 0,
      avg_confidence: recentPredictions?.length
        ? recentPredictions.reduce((sum, p) => sum + (p.confidence as number), 0) / recentPredictions.length
        : 0,
      high_probability_count: recentPredictions?.filter(p => (p.predicted_value as number) >= 0.6).length ?? 0,
    };

    const model = getActiveModel();

    return NextResponse.json({
      stats,
      model: {
        version: model.version,
        trained_at: model.trained_at,
      },
    });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      { error: "Failed to get predictions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "train") {
      const supabase = await createServiceClient();

      // Fetch all lead profiles for training
      const { data: profiles, error: profilesError } = await supabase
        .from("lead_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (profilesError || !profiles || profiles.length === 0) {
        return NextResponse.json(
          { error: "No profiles available for training" },
          { status: 400 }
        );
      }

      // Fetch conversion events to identify positive samples
      const { data: conversions } = await supabase
        .from("conversion_events")
        .select("lead_profile_id, conversion_type");

      const convertedProfileIds = new Set(
        conversions?.map(c => c.lead_profile_id) ?? []
      );

      // Build training dataset
      const trainingData: TrainingDataPoint[] = profiles.map((profile) => {
        const leadProfile = profile as LeadProfile;
        const features = extractFeatures(leadProfile);
        const isConverted = convertedProfileIds.has(leadProfile.id);

        // Also consider high-stage leads as positive samples for bootstrapping
        const isHighStage = ["qualified", "opportunity"].includes(leadProfile.journey_stage);

        return {
          feature_vector: features,
          label: (isConverted || isHighStage ? 1 : 0) as 0 | 1,
          weight: isConverted ? 2.0 : 1.0, // Weight actual conversions higher
        };
      });

      // Ensure we have both positive and negative samples
      const positiveCount = trainingData.filter(d => d.label === 1).length;
      const negativeCount = trainingData.filter(d => d.label === 0).length;

      if (positiveCount === 0 || negativeCount === 0) {
        return NextResponse.json({
          warning: "Insufficient training data",
          positive_samples: positiveCount,
          negative_samples: negativeCount,
          message: "Need both converted and non-converted leads for training",
        });
      }

      // Train the model
      const newModel = trainModel(trainingData, {
        learningRate: 0.01,
        regularization: 0.1,
        maxIterations: 1000,
      });

      // Set as active model
      setActiveModel(newModel);

      // Calculate accuracy metrics on training data
      let truePositives = 0;
      let trueNegatives = 0;
      let falsePositives = 0;
      let falseNegatives = 0;

      for (const dataPoint of trainingData) {
        const prediction = predict(dataPoint.feature_vector, newModel);
        const predictedLabel = prediction >= 0.5 ? 1 : 0;

        if (dataPoint.label === 1 && predictedLabel === 1) truePositives++;
        else if (dataPoint.label === 0 && predictedLabel === 0) trueNegatives++;
        else if (dataPoint.label === 0 && predictedLabel === 1) falsePositives++;
        else falseNegatives++;
      }

      const accuracy = (truePositives + trueNegatives) / trainingData.length;
      const precision = truePositives / (truePositives + falsePositives) || 0;
      const recall = truePositives / (truePositives + falseNegatives) || 0;
      const f1 = 2 * (precision * recall) / (precision + recall) || 0;

      const confusionMatrix: ConfusionMatrix = {
        true_positives: truePositives,
        true_negatives: trueNegatives,
        false_positives: falsePositives,
        false_negatives: falseNegatives,
      };

      const metrics: ModelAccuracyMetrics = {
        accuracy: Math.round(accuracy * 1000) / 1000,
        precision: Math.round(precision * 1000) / 1000,
        recall: Math.round(recall * 1000) / 1000,
        f1_score: Math.round(f1 * 1000) / 1000,
        auc_roc: 0, // Would need ROC curve calculation
        samples_trained: trainingData.length,
        samples_validated: 0,
        confusion_matrix: confusionMatrix,
      };

      // Save model metadata to database
      await supabase.from("ml_models").insert({
        model_type: "conversion_probability",
        model_version: newModel.version,
        training_date: newModel.trained_at,
        accuracy_metrics: metrics,
        feature_importance: Object.entries(newModel.weights).map(([name, weight]) => ({
          feature_name: name,
          importance: Math.abs(weight),
          direction: weight >= 0 ? "positive" : "negative",
        })),
        training_config: {
          learning_rate: 0.01,
          regularization: 0.1,
          max_iterations: 1000,
          convergence_threshold: 0.0001,
          feature_scaling: true,
          cross_validation_folds: 0,
        },
        is_active: true,
      });

      return NextResponse.json({
        success: true,
        model_version: newModel.version,
        trained_at: newModel.trained_at,
        samples_trained: trainingData.length,
        positive_samples: positiveCount,
        negative_samples: negativeCount,
        accuracy_metrics: metrics,
        feature_weights: newModel.weights,
      });
    }

    // Predict for provided profile data
    const body = await request.json();

    if (!body.profile) {
      return NextResponse.json(
        { error: "Profile data required" },
        { status: 400 }
      );
    }

    const prediction = getPredictionResult(body.profile as LeadProfile);
    const enhancedScore = getEnhancedScore(body.profile as LeadProfile);

    return NextResponse.json({
      prediction,
      enhanced_score: enhancedScore,
    });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      { error: "Prediction failed" },
      { status: 500 }
    );
  }
}
