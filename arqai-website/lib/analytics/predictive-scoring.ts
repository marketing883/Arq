/**
 * Predictive Conversion Scoring
 *
 * ML-based conversion probability prediction using logistic regression.
 * Built entirely in TypeScript - no external ML services required.
 *
 * ACCURACY: Uses sigmoid function with feature scaling.
 * TRAINING: Can be retrained on historical conversion data.
 */

import { createServiceClient } from "@/lib/supabase/server";
import type { LeadProfile } from "@/types/lead-intelligence-v2";
import type {
  FeatureVector,
  PredictionResult,
  LogisticRegressionModel,
  INITIAL_MODEL_WEIGHTS,
  RiskFactor,
  PositiveIndicator,
  EnhancedScore,
  TrainingDataPoint,
  ModelAccuracyMetrics,
  BatchPredictionResult,
  BatchPredictionSummary,
} from "@/types/predictive";

// ============================================
// INITIAL MODEL (before training on real data)
// ============================================

const INITIAL_WEIGHTS: LogisticRegressionModel = {
  weights: {
    days_since_first_touch: -0.02,
    total_touchpoints: 0.15,
    unique_sources: 0.2,
    signal_diversity: 0.25,
    engagement_velocity: 0.3,
    icp_fit_score: 0.35,
    journey_stage_ordinal: 0.4,
    has_demo_signal: 0.8,
    has_pricing_signal: 0.6,
    has_competitor_signal: 0.3,
    company_size_ordinal: 0.2,
    days_since_last_touch: -0.05,
    avg_session_duration: 0.1,
    resource_downloads: 0.25,
    chat_conversations: 0.2,
    form_submissions: 0.5,
    page_views: 0.05,
  },
  bias: -2.0,
  feature_means: {
    days_since_first_touch: 14,
    total_touchpoints: 5,
    unique_sources: 2,
    signal_diversity: 3,
    engagement_velocity: 5,
    icp_fit_score: 50,
    journey_stage_ordinal: 2,
    company_size_ordinal: 2,
    days_since_last_touch: 3,
    avg_session_duration: 180,
    resource_downloads: 1,
    chat_conversations: 1,
    form_submissions: 0.5,
    page_views: 10,
  },
  feature_stds: {
    days_since_first_touch: 21,
    total_touchpoints: 8,
    unique_sources: 2,
    signal_diversity: 4,
    engagement_velocity: 10,
    icp_fit_score: 30,
    journey_stage_ordinal: 1.5,
    company_size_ordinal: 1,
    days_since_last_touch: 7,
    avg_session_duration: 300,
    resource_downloads: 2,
    chat_conversations: 2,
    form_submissions: 1,
    page_views: 15,
  },
  version: "1.0.0-initial",
  trained_at: new Date().toISOString(),
};

// Current active model (starts with initial, can be updated)
let activeModel: LogisticRegressionModel = INITIAL_WEIGHTS;

// ============================================
// FEATURE EXTRACTION
// ============================================

/**
 * Extract features from a lead profile
 */
export function extractFeatures(profile: LeadProfile): FeatureVector {
  // Count unique sources
  const uniqueSources = new Set<string>();
  if (profile.touchpoints.chat.length > 0) uniqueSources.add("chat");
  if (profile.touchpoints.contact_forms.length > 0) uniqueSources.add("contact_form");
  if (profile.touchpoints.resource_downloads.length > 0) uniqueSources.add("resource_download");
  if (profile.touchpoints.webinar_registrations.length > 0) uniqueSources.add("webinar");
  if (profile.touchpoints.page_views.length > 0) uniqueSources.add("page_view");
  if (profile.touchpoints.newsletter_signups.length > 0) uniqueSources.add("newsletter");

  // Count unique signal types
  const signalTypes = new Set(profile.scored_signals.map(s => s.type));

  // Check for specific signals
  const hasDemo = profile.scored_signals.some(s => s.type === "demo_request");
  const hasPricing = profile.scored_signals.some(s => s.type === "pricing_interest");
  const hasCompetitor = profile.scored_signals.some(s => s.type === "competitor_mention");

  // Map company size to ordinal
  const sizeOrdinal: Record<string, number> = {
    startup: 1,
    smb: 2,
    "mid-market": 3,
    enterprise: 4,
  };
  const companySizeOrdinal = sizeOrdinal[profile.company_intel?.size ?? "smb"] ?? 2;

  // Map journey stage to ordinal
  const stageOrdinal: Record<string, number> = {
    anonymous: 0,
    identified: 1,
    engaged: 2,
    qualified: 3,
    opportunity: 4,
  };
  const journeyStageOrdinal = stageOrdinal[profile.journey_stage] ?? 0;

  // Count touchpoints by type
  const totalChats = profile.touchpoints.chat.reduce((sum, c) => sum + c.message_count, 0);

  return {
    days_since_first_touch: profile.days_since_first_touch,
    total_touchpoints: profile.total_touchpoints,
    unique_sources: uniqueSources.size,
    signal_diversity: signalTypes.size,
    engagement_velocity: profile.engagement_velocity,
    icp_fit_score: profile.icp_fit_score,
    journey_stage_ordinal: journeyStageOrdinal,
    has_demo_signal: hasDemo,
    has_pricing_signal: hasPricing,
    has_competitor_signal: hasCompetitor,
    company_size_ordinal: companySizeOrdinal,
    days_since_last_touch: profile.days_since_last_touch,
    avg_session_duration: 0, // Would come from analytics
    resource_downloads: profile.touchpoints.resource_downloads.length,
    chat_conversations: profile.touchpoints.chat.length,
    form_submissions: profile.touchpoints.contact_forms.length,
    page_views: profile.touchpoints.page_views.length,
  };
}

// ============================================
// PREDICTION
// ============================================

/**
 * Sigmoid activation function
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Scale a feature value using z-score normalization
 */
function scaleFeature(value: number, mean: number, std: number): number {
  if (std === 0) return 0;
  return (value - mean) / std;
}

/**
 * Calculate prediction from feature vector
 */
export function predict(features: FeatureVector, model: LogisticRegressionModel = activeModel): number {
  let logit = model.bias;

  for (const [feature, weight] of Object.entries(model.weights)) {
    const featureKey = feature as keyof FeatureVector;
    let featureValue = features[featureKey];

    // Handle boolean features
    if (typeof featureValue === "boolean") {
      featureValue = featureValue ? 1 : 0;
    }

    // Scale numerical features
    const mean = model.feature_means[feature] ?? 0;
    const std = model.feature_stds[feature] ?? 1;
    const scaledValue = scaleFeature(featureValue as number, mean, std);

    logit += scaledValue * weight;
  }

  return sigmoid(logit);
}

/**
 * Get prediction with confidence and insights
 */
export function getPredictionResult(profile: LeadProfile): PredictionResult {
  const features = extractFeatures(profile);
  const probability = predict(features);

  // Calculate confidence based on data completeness
  const dataPoints = [
    features.total_touchpoints > 0,
    features.unique_sources > 1,
    features.signal_diversity > 2,
    profile.company_intel?.company_name != null,
    profile.company_intel?.size != null,
    profile.canonical_email != null,
  ];
  const confidence = dataPoints.filter(Boolean).length / dataPoints.length;

  // Identify risk factors
  const riskFactors: RiskFactor[] = [];
  if (features.days_since_last_touch > 14) {
    riskFactors.push({
      factor: "inactivity",
      impact: features.days_since_last_touch > 30 ? "high" : "medium",
      description: `No activity in ${features.days_since_last_touch} days`,
    });
  }
  if (features.engagement_velocity < 3) {
    riskFactors.push({
      factor: "low_engagement",
      impact: "medium",
      description: "Low engagement velocity indicates cooling interest",
    });
  }
  if (features.journey_stage_ordinal < 2) {
    riskFactors.push({
      factor: "early_stage",
      impact: "low",
      description: "Lead is still in early journey stage",
    });
  }

  // Identify positive indicators
  const positiveIndicators: PositiveIndicator[] = [];
  if (features.has_demo_signal) {
    positiveIndicators.push({
      indicator: "demo_intent",
      strength: "strong",
      description: "Expressed interest in demo or trial",
    });
  }
  if (features.has_pricing_signal) {
    positiveIndicators.push({
      indicator: "pricing_interest",
      strength: "strong",
      description: "Inquired about pricing or budget",
    });
  }
  if (features.company_size_ordinal >= 3) {
    positiveIndicators.push({
      indicator: "enterprise_size",
      strength: "moderate",
      description: "Mid-market or enterprise company",
    });
  }
  if (features.icp_fit_score >= 70) {
    positiveIndicators.push({
      indicator: "high_icp_fit",
      strength: "strong",
      description: "Strong fit with ideal customer profile",
    });
  }
  if (features.form_submissions > 0) {
    positiveIndicators.push({
      indicator: "form_submitted",
      strength: "moderate",
      description: "Submitted contact form",
    });
  }

  // Generate recommended actions
  const recommendedActions: string[] = [];
  if (probability >= 0.7) {
    recommendedActions.push("Schedule immediate sales call");
    recommendedActions.push("Send personalized proposal");
  } else if (probability >= 0.4) {
    recommendedActions.push("Send targeted content based on interests");
    recommendedActions.push("Invite to relevant webinar");
  } else {
    recommendedActions.push("Add to nurture sequence");
    recommendedActions.push("Monitor for engagement signals");
  }

  if (riskFactors.some(r => r.factor === "inactivity")) {
    recommendedActions.unshift("Re-engage with personalized outreach");
  }

  return {
    lead_profile_id: profile.id,
    conversion_probability: Math.round(probability * 1000) / 1000,
    confidence: Math.round(confidence * 100) / 100,
    risk_factors: riskFactors,
    positive_indicators: positiveIndicators,
    recommended_actions: recommendedActions,
    model_version: activeModel.version,
    predicted_at: new Date().toISOString(),
  };
}

/**
 * Get enhanced score combining base score with ML prediction
 */
export function getEnhancedScore(profile: LeadProfile): EnhancedScore {
  const features = extractFeatures(profile);
  const probability = predict(features);

  // ML bonus: add up to 15 points based on prediction
  const mlBonus = probability * 15;

  // Ensure final score doesn't exceed 100
  const finalScore = Math.min(profile.composite_score + mlBonus, 100);

  return {
    lead_profile_id: profile.id,
    base_score: profile.composite_score,
    ml_adjustment: mlBonus,
    final_score: Math.round(finalScore * 100) / 100,
    conversion_probability: probability,
    score_breakdown: {
      behavior_score: profile.decay_adjusted_score,
      engagement_score: profile.engagement_score,
      fit_score: profile.icp_fit_score,
      intent_score: profile.intent_score,
      velocity_score: profile.engagement_velocity,
      ml_bonus: mlBonus,
    },
    calculated_at: new Date().toISOString(),
  };
}

// ============================================
// BATCH PREDICTIONS
// ============================================

/**
 * Get predictions for multiple profiles
 */
export function getBatchPredictions(profiles: LeadProfile[]): BatchPredictionResult {
  const predictions = profiles.map(p => getPredictionResult(p));

  const highCount = predictions.filter(p => p.conversion_probability >= 0.6).length;
  const mediumCount = predictions.filter(
    p => p.conversion_probability >= 0.3 && p.conversion_probability < 0.6
  ).length;
  const lowCount = predictions.filter(p => p.conversion_probability < 0.3).length;

  const avgProbability = predictions.reduce((sum, p) => sum + p.conversion_probability, 0) / predictions.length;
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

  const summary: BatchPredictionSummary = {
    total_predictions: predictions.length,
    high_probability_count: highCount,
    medium_probability_count: mediumCount,
    low_probability_count: lowCount,
    avg_probability: Math.round(avgProbability * 1000) / 1000,
    avg_confidence: Math.round(avgConfidence * 100) / 100,
  };

  return {
    job_id: crypto.randomUUID(),
    predictions,
    summary,
  };
}

// ============================================
// MODEL TRAINING (for future use)
// ============================================

/**
 * Train model on historical data
 * Uses gradient descent with L2 regularization
 */
export function trainModel(
  trainingData: TrainingDataPoint[],
  config: {
    learningRate?: number;
    regularization?: number;
    maxIterations?: number;
    convergenceThreshold?: number;
  } = {}
): LogisticRegressionModel {
  const {
    learningRate = 0.01,
    regularization = 0.1,
    maxIterations = 1000,
    convergenceThreshold = 0.0001,
  } = config;

  // Initialize weights
  const weights: Record<string, number> = { ...INITIAL_WEIGHTS.weights };
  let bias = INITIAL_WEIGHTS.bias;

  // Calculate feature statistics for scaling
  const featureMeans: Record<string, number> = {};
  const featureStds: Record<string, number> = {};

  const featureKeys = Object.keys(weights);
  for (const key of featureKeys) {
    const values = trainingData.map(d => {
      const val = d.feature_vector[key as keyof FeatureVector];
      return typeof val === "boolean" ? (val ? 1 : 0) : (val as number);
    });
    featureMeans[key] = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - featureMeans[key], 2), 0) / values.length;
    featureStds[key] = Math.sqrt(variance) || 1;
  }

  // Gradient descent
  let prevLoss = Infinity;
  for (let iter = 0; iter < maxIterations; iter++) {
    let totalLoss = 0;
    const gradients: Record<string, number> = {};
    let biasGradient = 0;

    for (const key of featureKeys) {
      gradients[key] = 0;
    }

    // Calculate gradients
    for (const dataPoint of trainingData) {
      const features = dataPoint.feature_vector;
      let logit = bias;

      for (const key of featureKeys) {
        let val = features[key as keyof FeatureVector];
        if (typeof val === "boolean") val = val ? 1 : 0;
        const scaled = scaleFeature(val as number, featureMeans[key], featureStds[key]);
        logit += scaled * weights[key];
      }

      const prediction = sigmoid(logit);
      const error = prediction - dataPoint.label;
      const weight = dataPoint.weight ?? 1;

      // Accumulate gradients
      for (const key of featureKeys) {
        let val = features[key as keyof FeatureVector];
        if (typeof val === "boolean") val = val ? 1 : 0;
        const scaled = scaleFeature(val as number, featureMeans[key], featureStds[key]);
        gradients[key] += error * scaled * weight;
      }
      biasGradient += error * weight;

      // Cross-entropy loss
      const loss = dataPoint.label === 1
        ? -Math.log(prediction + 1e-10)
        : -Math.log(1 - prediction + 1e-10);
      totalLoss += loss * weight;
    }

    // Update weights with regularization
    for (const key of featureKeys) {
      gradients[key] /= trainingData.length;
      gradients[key] += regularization * weights[key]; // L2 regularization
      weights[key] -= learningRate * gradients[key];
    }
    biasGradient /= trainingData.length;
    bias -= learningRate * biasGradient;

    totalLoss /= trainingData.length;

    // Check convergence
    if (Math.abs(prevLoss - totalLoss) < convergenceThreshold) {
      break;
    }
    prevLoss = totalLoss;
  }

  return {
    weights,
    bias,
    feature_means: featureMeans,
    feature_stds: featureStds,
    version: `${Date.now()}`,
    trained_at: new Date().toISOString(),
  };
}

/**
 * Set active model
 */
export function setActiveModel(model: LogisticRegressionModel): void {
  activeModel = model;
}

/**
 * Get current active model
 */
export function getActiveModel(): LogisticRegressionModel {
  return activeModel;
}

/**
 * Save prediction to history
 */
export async function savePrediction(
  profileId: string,
  prediction: PredictionResult,
  features: FeatureVector
): Promise<void> {
  try {
    const supabase = await createServiceClient();

    await supabase.from("prediction_history").insert({
      lead_profile_id: profileId,
      prediction_type: "conversion_probability",
      predicted_value: prediction.conversion_probability,
      confidence: prediction.confidence,
      model_version: prediction.model_version,
      feature_vector: features,
    });
  } catch (error) {
    console.error("Failed to save prediction:", error);
  }
}
