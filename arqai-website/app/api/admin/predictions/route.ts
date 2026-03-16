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
} from "@/lib/analytics/predictive-scoring";
import { createServiceClient } from "@/lib/supabase/server";
import type { LeadProfile } from "@/types/lead-intelligence-v2";

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
      // Future: Implement model training endpoint
      return NextResponse.json(
        { error: "Model training not yet implemented" },
        { status: 501 }
      );
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
