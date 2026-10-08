import { Patient, WaveformPoint, CloudSyncStats, AppMode, PathologyType, TimelineEvent } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "P101",
    name: "Heet Shah",
    bed: "ICU-Bed 01",
    age: 24,
    gender: "M",
    admission_reason: "Post-Op Cardiac Recovery",
    status: "Stable",
    vitals: { heart_rate: 72, spo2: 98, temperature: 36.8, respiratory_rate: 15, gsr_microsiemens: 2.1, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.96 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.94,
      risk_score: 0.05,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 14.2,
      contributing_factors: [],
      clinical_insight: "Physiological baseline stable. Hemodynamic parameters well compensated."
    },
    last_update: Date.now()
  },
  {
    id: "P102",
    name: "Jigyasa Lunawat",
    bed: "Step-Down 04",
    age: 23,
    gender: "F",
    admission_reason: "Asthma Observation",
    status: "Stable",
    vitals: { heart_rate: 82, spo2: 97, temperature: 36.7, respiratory_rate: 17, gsr_microsiemens: 2.4, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.95 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.92,
      risk_score: 0.12,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 13.8,
      contributing_factors: ["Mild baseline airflow limitation"],
      clinical_insight: "Respiratory rhythm regular; oxygen saturation acceptable for profile."
    },
    last_update: Date.now()
  },
  {
    id: "P103",
    name: "Prajjwal Gupta",
    bed: "Telemetry 02",
    age: 25,
    gender: "M",
    admission_reason: "Suspected Sepsis / High Pyrexia",
    status: "Warning",
    vitals: { heart_rate: 106, spo2: 94, temperature: 38.8, respiratory_rate: 22, gsr_microsiemens: 4.8, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.92 },
    ai_analysis: {
      predicted_state: "Sepsis/Fever",
      confidence: 0.84,
      risk_score: 0.61,
      risk_level: "MODERATE",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 15.1,
      contributing_factors: ["Core temp 38.8°C", "Tachycardia (106 BPM)", "Elevated skin conductance"],
      clinical_insight: "Elevated thermal and autonomic response pattern. Hyperthermia and tachycardia detected. Sepsis workup suggested."
    },
    last_update: Date.now()
  },
  {
    id: "P104",
    name: "Aditi Shanbhag",
    bed: "ICU-Bed 03",
    age: 24,
    gender: "F",
    admission_reason: "Acute Respiratory Distress / Hypoxia",
    status: "Critical",
    vitals: { heart_rate: 121, spo2: 89, temperature: 38.7, respiratory_rate: 29, gsr_microsiemens: 6.2, motion_activity: "Minor Movement" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "DEGRADED", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.88 },
    ai_analysis: {
      predicted_state: "Hypoxia",
      confidence: 0.87,
      risk_score: 0.87,
      risk_level: "HIGH",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 14.6,
      contributing_factors: ["SpO₂ declined 98% → 89%", "Tachycardia 121 BPM", "Tachypnea 29/min", "Worsening temporal trend"],
      clinical_insight: "HIGH RISK: Hypoxia pattern detected with 87% AI confidence. Rapid desaturation trend observed over observation window. Clinical verification recommended."
    },
    last_update: Date.now()
  },
  {
    id: "P105",
    name: "Harshi Mehta",
    bed: "Step-Down 07",
    age: 23,
    gender: "F",
    admission_reason: "Ventricular Arrhythmia Evaluation",
    status: "Warning",
    vitals: { heart_rate: 112, spo2: 95, temperature: 36.9, respiratory_rate: 19, gsr_microsiemens: 3.1, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.91 },
    ai_analysis: {
      predicted_state: "Arrhythmia",
      confidence: 0.89,
      risk_score: 0.58,
      risk_level: "MODERATE",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 14.0,
      contributing_factors: ["Frequent irregular R-R intervals", "Tachycardia 112 BPM"],
      clinical_insight: "Arrhythmia pattern detected. Irregular ventricular intervals noted on AD8232 lead. Bedside rhythm strip review recommended."
    },
    last_update: Date.now()
  },
  {
    id: "P106",
    name: "Aarav Deshmukh",
    bed: "Ward 12A",
    age: 32,
    gender: "M",
    admission_reason: "Trauma Observation / Concussion",
    status: "Stable",
    vitals: { heart_rate: 76, spo2: 99, temperature: 36.6, respiratory_rate: 14, gsr_microsiemens: 1.8, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.98 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.96,
      risk_score: 0.04,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 13.9,
      contributing_factors: [],
      clinical_insight: "Stable baseline; neurological vitals stable."
    },
    last_update: Date.now()
  },
  {
    id: "P107",
    name: "Rohan Kulkarni",
    bed: "ICU-Bed 05",
    age: 67,
    gender: "M",
    admission_reason: "Septic Shock / Vasopressor Support",
    status: "Critical",
    vitals: { heart_rate: 134, spo2: 87, temperature: 35.3, respiratory_rate: 33, gsr_microsiemens: 7.9, motion_activity: "Resting" },
    quality: { ppg: "DEGRADED", ecg: "GOOD", temp: "GOOD", resp: "DEGRADED", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.82 },
    ai_analysis: {
      predicted_state: "Shock",
      confidence: 0.92,
      risk_score: 0.94,
      risk_level: "CRITICAL",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 15.3,
      contributing_factors: ["Severe tachycardia 134 BPM", "Hypothermia 35.3°C", "Hypoxemia 87%", "Elevated sympathetic tone"],
      clinical_insight: "CRITICAL: Multimodal hemodynamic decompensation pattern. Concurrent hypothermia, severe tachycardia, and tachypnea. Urgent clinical assessment required."
    },
    last_update: Date.now()
  },
  {
    id: "P108",
    name: "Ananya Iyer",
    bed: "Ward 14B",
    age: 29,
    gender: "F",
    admission_reason: "Pneumonia Management",
    status: "Stable",
    vitals: { heart_rate: 78, spo2: 96, temperature: 37.1, respiratory_rate: 18, gsr_microsiemens: 2.2, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.94 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.91,
      risk_score: 0.16,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 14.1,
      contributing_factors: [],
      clinical_insight: "Resolving pulmonary infection. Oxygenation stable on room air."
    },
    last_update: Date.now()
  },
  {
    id: "P109",
    name: "Siddharth Nair",
    bed: "Telemetry 06",
    age: 45,
    gender: "M",
    admission_reason: "Congestive Heart Failure",
    status: "Warning",
    vitals: { heart_rate: 98, spo2: 93, temperature: 36.8, respiratory_rate: 23, gsr_microsiemens: 3.5, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.92 },
    ai_analysis: {
      predicted_state: "Hypoxia",
      confidence: 0.73,
      risk_score: 0.52,
      risk_level: "MODERATE",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 14.4,
      contributing_factors: ["Mild desaturation 93%", "Tachypnea 23/min"],
      clinical_insight: "Borderline desaturation with fluid congestion signs. Continuous monitoring active."
    },
    last_update: Date.now()
  },
  {
    id: "P110",
    name: "Diya Sengupta",
    bed: "Ward 08C",
    age: 28,
    gender: "F",
    admission_reason: "Post-Surgical Monitoring",
    status: "Stable",
    vitals: { heart_rate: 68, spo2: 99, temperature: 36.6, respiratory_rate: 13, gsr_microsiemens: 1.5, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.99 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.98,
      risk_score: 0.02,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 13.5,
      contributing_factors: [],
      clinical_insight: "Normal postoperative convalescence. Stable vitals."
    },
    last_update: Date.now()
  },
  {
    id: "P111",
    name: "Priya Sharma",
    bed: "ICU-Bed 08",
    age: 52,
    gender: "F",
    admission_reason: "Severe Bronchospasm",
    status: "Stable",
    vitals: { heart_rate: 84, spo2: 96, temperature: 36.9, respiratory_rate: 18, gsr_microsiemens: 2.7, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.95 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.93,
      risk_score: 0.14,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 14.2,
      contributing_factors: [],
      clinical_insight: "Airway obstruction resolved following bronchodilator therapy. Respiratory effort regular."
    },
    last_update: Date.now()
  },
  {
    id: "P112",
    name: "Arjun Malhotra",
    bed: "Step-Down 09",
    age: 38,
    gender: "M",
    admission_reason: "Syncope Evaluation",
    status: "Stable",
    vitals: { heart_rate: 74, spo2: 98, temperature: 36.7, respiratory_rate: 15, gsr_microsiemens: 2.0, motion_activity: "Resting" },
    quality: { ppg: "GOOD", ecg: "GOOD", temp: "GOOD", resp: "GOOD", imu: "GOOD", gsr: "GOOD", overall_sqi: 0.97 },
    ai_analysis: {
      predicted_state: "Normal",
      confidence: 0.95,
      risk_score: 0.06,
      risk_level: "LOW",
      model_version: "BlueEdge-CNN-BiLSTM-v1.4",
      inference_latency_ms: 13.7,
      contributing_factors: [],
      clinical_insight: "Orthostatic vitals stable; continuous telemetry monitoring."
    },
    last_update: Date.now()
  }
];

export const INITIAL_TIMELINES: Record<string, TimelineEvent[]> = {
  P104: [
    { timestamp: "08:00", status: "Stable", event: "Patient admitted to ICU. Initial vitals stable (SpO₂: 98%, HR: 74)." },
    { timestamp: "09:15", status: "Stable", event: "Edge SQA verified sensor lead adhesion. Signal quality index: 0.96." },
    { timestamp: "10:10", status: "Warning", event: "Mild respiratory trend deviation: SpO₂ declined 98% → 94%." },
    { timestamp: "10:18", status: "Warning", event: "Edge AI BiLSTM temporal window detected desaturation slope." },
    { timestamp: "10:20", status: "Critical", event: "High-risk Hypoxia alert generated locally (SpO₂: 89%, HR: 121, Risk: 0.87)." },
    { timestamp: "10:25", status: "Critical", event: "Local alert audio triggered at bedside. Buffered for selective cloud sync." },
    { timestamp: "10:40", status: "Warning", event: "Oxygen mask applied. Stabilization in progress." }
  ],
  P103: [
    { timestamp: "08:30", status: "Stable", event: "Patient admitted for observation. Baseline temp: 37.2°C." },
    { timestamp: "09:45", status: "Warning", event: "Thermal drift detected on MLX90614 sensor: temp rose to 38.4°C." },
    { timestamp: "10:15", status: "Warning", event: "Sepsis/Fever pattern confirmed by Edge AI (Confidence: 84%)." }
  ],
  P105: [
    { timestamp: "09:00", status: "Stable", event: "Telemetry monitoring active." },
    { timestamp: "10:05", status: "Warning", event: "AD8232 Pan-Tompkins peak detector noted premature ventricular contractions (PVC)." },
    { timestamp: "10:15", status: "Warning", event: "Arrhythmia risk score elevated to 0.58." }
  ]
};
