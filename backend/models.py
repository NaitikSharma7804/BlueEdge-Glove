"""
BlueEdge Glove — Data Models & Schemas
Core definitions for Patients, Vitals, Signals, AI Inferences, and Sync Payloads.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import time

class SensorQuality(BaseModel):
    ppg: str = "GOOD"         # GOOD, DEGRADED, POOR
    ecg: str = "GOOD"
    temp: str = "GOOD"
    resp: str = "GOOD"
    imu: str = "GOOD"
    gsr: str = "GOOD"
    overall_sqi: float = 0.94  # 0.0 to 1.0

class WaveformPoint(BaseModel):
    t: float
    ppg: float
    ecg: float
    resp: float
    gsr: float
    accel_mag: float

class PatientVitals(BaseModel):
    heart_rate: int = 72          # bpm
    spo2: int = 98                # %
    temperature: float = 36.8     # °C
    respiratory_rate: int = 15    # breaths/min
    gsr_microsiemens: float = 2.1 # µS
    motion_activity: str = "Resting" # Resting, Minor Movement, High Motion

class AIInferenceResult(BaseModel):
    predicted_state: str = "Normal" # Normal, Hypoxia, Arrhythmia, Sepsis/Fever, Shock
    confidence: float = 0.95        # 0.0 to 1.0
    risk_score: float = 0.05        # 0.0 to 1.0
    risk_level: str = "LOW"         # LOW, MODERATE, HIGH, CRITICAL
    model_version: str = "BlueEdge-CNN-BiLSTM-v1.4"
    inference_latency_ms: float = 14.2
    contributing_factors: List[str] = []
    clinical_insight: str = "Physiological parameters within normal baseline. Stable."

class Patient(BaseModel):
    id: str
    name: str
    bed: str
    age: int
    gender: str
    admission_reason: str
    status: str = "Stable"          # Stable, Warning, Critical
    vitals: PatientVitals
    quality: SensorQuality
    ai_analysis: AIInferenceResult
    last_update: float = Field(default_factory=time.time)
    is_discharged: bool = False
    admitted_at: Optional[str] = "08:00 AM"
    discharged_at: Optional[str] = None
    discharge_disposition: Optional[str] = None
    discharge_notes: Optional[str] = None
    glove_id: Optional[str] = "BE-GLOVE-01"

class CloudSyncPayload(BaseModel):
    patient_id: str
    timestamp: float
    heart_rate: int
    spo2: int
    temperature: float
    respiratory_rate: int
    risk_score: float
    risk_level: str
    predicted_state: str
    overall_sqi: float
    model_version: str
    event_type: str = "PERIODIC_SUMMARY" # PERIODIC_SUMMARY, RISK_ALERT, ARTIFACT_FLAG

class SystemStatus(BaseModel):
    mode: str = "SIMULATION"        # LIVE_HARDWARE, SIMULATION, RESEARCH
    esp32_gateway_connected: bool = True
    signal_preprocessing_active: bool = True
    edge_ai_active: bool = True
    risk_engine_active: bool = True
    local_storage_active: bool = True
    cloud_sync_active: bool = True
    internet_connected: bool = True
    buffered_events_count: int = 0
    raw_data_processed_kb: float = 4850.0
    cloud_sync_transmitted_kb: float = 24.5
    bandwidth_reduction_pct: float = 99.49
    edge_inference_latency_ms: float = 14.8
