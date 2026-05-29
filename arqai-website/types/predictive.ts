/**
 * Predictive Analytics Types
 *
 * Types for ML-based conversion prediction and scoring.
 * Built-in logistic regression model - no external ML services required.
 */

// ============================================
// CONVERSION EVENT TYPES
// ============================================

export type ConversionType =
  | "demo_booked"
  | "opportunity_created"
  | "proposal_sent"
  | "closed_won"
  | "closed_lost";

export interface ConversionEvent {
  id: string;
  lead_profile_id: string;
  conversion_type: ConversionType;
  conversion_value?: number;
  attributed_touchpoints: AttributedTouchpoint[];
  time_to_conversion_hours: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AttributedTouchpoint {
  touchpoint_id: string;
  source: string;
  event_type: string;
  credit_percentage: number;
  timestamp: string;
}

// ============================================
// ML MODEL TYPES
// ============================================

export type ModelType = "conversion_probability" | "lead_scoring" | "churn_prediction";

export interface MLModelMetadata {
  id: string;
  model_type: ModelType;
  model_version: string;
  training_date: string;
  accuracy_metrics: ModelAccuracyMetrics;
  feature_importance: FeatureImportance[];
  training_config: TrainingConfig;
  is_active: boolean;
  created_at: string;
}

export interface ModelAccuracyMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  samples_trained: number;
  samples_validated: number;
  confusion_matrix: ConfusionMatrix;
}

export interface ConfusionMatrix {
  true_positives: number;
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
}

export interface FeatureImportance {
  feature_name: string;
  importance: number;
  direction: "positive" | "negative";
}

export interface TrainingConfig {
  learning_rate: number;
  regularization: number;
  max_iterations: number;
  convergence_threshold: number;
  feature_scaling: boolean;
  cross_validation_folds: number;
}

export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  learning_rate: 0.01,
  regularization: 0.1,
  max_iterations: 1000,
  convergence_threshold: 0.0001,
  feature_scaling: true,
  cross_validation_folds: 5,
};

// ============================================
// PREDICTION TYPES
// ============================================

export interface PredictionHistory {
  id: string;
  lead_profile_id: string;
  prediction_type: ModelType;
  predicted_value: number;
  confidence: number;
  model_version: string;
  feature_vector: FeatureVector;
  created_at: string;
}

export interface FeatureVector {
  days_since_first_touch: number;
  total_touchpoints: number;
  unique_sources: number;
  signal_diversity: number;
  engagement_velocity: number;
  icp_fit_score: number;
  journey_stage_ordinal: number;
  has_demo_signal: boolean;
  has_pricing_signal: boolean;
  has_competitor_signal: boolean;
  company_size_ordinal: number;
  days_since_last_touch: number;
  avg_session_duration: number;
  resource_downloads: number;
  chat_conversations: number;
  form_submissions: number;
  page_views: number;
  email_opens?: number;
  email_clicks?: number;
}

export interface PredictionResult {
  lead_profile_id: string;
  conversion_probability: number;
  confidence: number;
  risk_factors: RiskFactor[];
  positive_indicators: PositiveIndicator[];
  recommended_actions: string[];
  model_version: string;
  predicted_at: string;
}

export interface RiskFactor {
  factor: string;
  impact: "high" | "medium" | "low";
  description: string;
}

export interface PositiveIndicator {
  indicator: string;
  strength: "strong" | "moderate" | "weak";
  description: string;
}

// ============================================
// SCORING ENHANCEMENT TYPES
// ============================================

export interface EnhancedScore {
  lead_profile_id: string;
  base_score: number;
  ml_adjustment: number;
  final_score: number;
  conversion_probability: number;
  score_breakdown: ScoreBreakdown;
  calculated_at: string;
}

export interface ScoreBreakdown {
  behavior_score: number;
  engagement_score: number;
  fit_score: number;
  intent_score: number;
  velocity_score: number;
  ml_bonus: number;
}

// ============================================
// OPTIMAL TIMING TYPES
// ============================================

export interface OptimalContactTiming {
  lead_profile_id: string;
  best_day_of_week: number;
  best_hour_of_day: number;
  timezone?: string;
  confidence: number;
  reasoning: string[];
  next_optimal_window: OptimalWindow;
  calculated_at: string;
}

export interface OptimalWindow {
  start: string;
  end: string;
  score: number;
}

// ============================================
// TRAINING DATA TYPES
// ============================================

export interface TrainingDataPoint {
  feature_vector: FeatureVector;
  label: 0 | 1;
  conversion_type?: ConversionType;
  weight?: number;
}

export interface TrainingDataset {
  id: string;
  created_at: string;
  data_points: TrainingDataPoint[];
  positive_samples: number;
  negative_samples: number;
  date_range_start: string;
  date_range_end: string;
}

// ============================================
// MODEL WEIGHTS (LOGISTIC REGRESSION)
// ============================================

export interface LogisticRegressionModel {
  weights: Record<string, number>;
  bias: number;
  feature_means: Record<string, number>;
  feature_stds: Record<string, number>;
  version: string;
  trained_at: string;
}

export const INITIAL_MODEL_WEIGHTS: LogisticRegressionModel = {
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

// ============================================
// BATCH PREDICTION TYPES
// ============================================

export interface BatchPredictionJob {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  total_leads: number;
  processed_leads: number;
  predictions_made: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface BatchPredictionResult {
  job_id: string;
  predictions: PredictionResult[];
  summary: BatchPredictionSummary;
}

export interface BatchPredictionSummary {
  total_predictions: number;
  high_probability_count: number;
  medium_probability_count: number;
  low_probability_count: number;
  avg_probability: number;
  avg_confidence: number;
}
