export type PathologyType = 'Normal' | 'Hypoxia' | 'Arrhythmia' | 'Sepsis/Fever' | 'Shock' | 'Motion Artifact';
export type AppMode = 'LIVE_HARDWARE' | 'SIMULATION' | 'RESEARCH';
export type SignalQualityState = 'GOOD' | 'DEGRADED' | 'POOR';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface SensorQuality {
  ppg: SignalQualityState;
  ecg: SignalQualityState;
  temp: SignalQualityState;
  resp: SignalQualityState;
  imu: SignalQualityState;
  gsr: SignalQualityState;
  overall_sqi: number;
}

export interface PatientVitals {
  heart_rate: number;
  spo2: number;
  temperature: number;
  respiratory_rate: number;
  gsr_microsiemens: number;
  motion_activity: string;
}

export interface AIInferenceResult {
  predicted_state: string;
  confidence: number;
  risk_score: number;
  risk_level: RiskLevel;
  model_version: string;
  inference_latency_ms: number;
  contributing_factors: string[];
  clinical_insight: string;
}

export interface Patient {
  id: string;
  name: string;
  bed: string;
  age: number;
  gender: string;
  admission_reason: string;
  status: 'Stable' | 'Warning' | 'Critical';
  vitals: PatientVitals;
  quality: SensorQuality;
  ai_analysis: AIInferenceResult;
  last_update: number;
  is_discharged?: boolean;
  admitted_at?: string;
  discharged_at?: string;
  discharge_disposition?: string;
  discharge_notes?: string;
  glove_id?: string;
}

export type ThemeMode = 'dark' | 'midnight' | 'light';

export interface WaveformPoint {
  t: number;
  ppg: number;
  ecg: number;
  resp: number;
  gsr: number;
  accel_mag: number;
}

export interface CloudSyncStats {
  internet_connected: boolean;
  cloud_sync_active: boolean;
  buffered_events_count: number;
  raw_data_processed_kb: number;
  cloud_sync_transmitted_kb: number;
  bandwidth_reduction_pct: number;
  recent_syncs: any[];
}

export interface SystemStatus {
  mode: AppMode;
  esp32_gateway_connected: boolean;
  signal_preprocessing_active: boolean;
  edge_ai_active: boolean;
  risk_engine_active: boolean;
  local_storage_active: boolean;
  cloud_sync_active: boolean;
  internet_connected: boolean;
  buffered_events_count: number;
  raw_data_processed_kb: number;
  cloud_sync_transmitted_kb: number;
  bandwidth_reduction_pct: number;
  edge_inference_latency_ms: number;
}

export interface TimelineEvent {
  timestamp: string;
  status: 'Stable' | 'Warning' | 'Critical';
  event: string;
}
