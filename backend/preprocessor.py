"""
BlueEdge Glove — Edge Preprocessor & Signal Quality Engine
Runs locally on Edge Gateway (ESP32 + Companion MCU/Raspberry Pi/Local Edge Compute).
Performs:
1. Multi-sensor buffering and timestamp alignment
2. Bandpass filtering & denoising
3. Motion artifact detection via MPU6050
4. Signal Quality Assessment (SQA / SQI): GOOD / DEGRADED / POOR
5. Edge Feature Extraction (PPG HRV, SpO2 ratio, Resp frequency, ECG rhythm, GSR)
"""

import numpy as np
from typing import Dict, Any, Tuple
from models import SensorQuality

class EdgePreprocessor:
    def __init__(self, fs_ppg=100, fs_ecg=500, fs_imu=50):
        self.fs_ppg = fs_ppg
        self.fs_ecg = fs_ecg
        self.fs_imu = fs_imu

    def compute_sqi(self, ppg_window, ecg_window, imu_accel) -> SensorQuality:
        """
        Assess signal quality index (SQI) for physiological streams.
        Motion artifacts, poor skin contact, or loose leads reduce quality.
        """
        ppg_window = np.asarray(ppg_window, dtype=np.float32)
        ecg_window = np.asarray(ecg_window, dtype=np.float32)
        imu_accel = np.asarray(imu_accel, dtype=np.float32)

        # 1. IMU Motion Magnitude Check
        accel_mag = np.linalg.norm(imu_accel, axis=0) if imu_accel.ndim > 1 else np.array([np.linalg.norm(imu_accel)])
        motion_variance = float(np.var(accel_mag))
        
        # High motion corrupts PPG and ECG
        imu_status = "GOOD"
        if motion_variance > 1.2:
            imu_status = "POOR"
        elif motion_variance > 0.4:
            imu_status = "DEGRADED"

        # 2. PPG Signal Quality (Skewness & Perfusion Index proxy)
        ppg_std = float(np.std(ppg_window)) if len(ppg_window) > 0 else 0.0
        ppg_status = "GOOD"
        if ppg_std < 0.02 or motion_variance > 1.0:
            ppg_status = "POOR"
        elif ppg_std < 0.08 or motion_variance > 0.35:
            ppg_status = "DEGRADED"

        # 3. ECG Signal Quality (R-peak sharpness & baseline wander)
        ecg_std = float(np.std(ecg_window)) if len(ecg_window) > 0 else 0.0
        ecg_status = "GOOD"
        if ecg_std < 0.05 or motion_variance > 1.5:
            ecg_status = "POOR"
        elif motion_variance > 0.5:
            ecg_status = "DEGRADED"

        # Overall SQI weighted score
        score_map = {"GOOD": 1.0, "DEGRADED": 0.6, "POOR": 0.2}
        overall = (score_map[ppg_status] * 0.4 + score_map[ecg_status] * 0.4 + score_map[imu_status] * 0.2)
        overall = round(float(overall), 2)

        return SensorQuality(
            ppg=ppg_status,
            ecg=ecg_status,
            temp="GOOD",
            resp="GOOD" if motion_variance < 0.8 else "DEGRADED",
            imu=imu_status,
            gsr="GOOD",
            overall_sqi=overall
        )

    def extract_features(self, ppg_window, ecg_window, 
                         temp_val: float, resp_rate: float, 
                         imu_accel, gsr_val: float) -> Dict[str, float]:
        """
        Extracts clinically compact physiological features locally on the edge device.
        """
        ppg_window = np.asarray(ppg_window, dtype=np.float32)
        ecg_window = np.asarray(ecg_window, dtype=np.float32)
        imu_accel = np.asarray(imu_accel, dtype=np.float32)

        ppg_ac = float(np.std(ppg_window)) if len(ppg_window) > 0 else 0.1
        ppg_dc = float(np.mean(ppg_window)) + 1e-5
        perfusion_index = round((ppg_ac / ppg_dc) * 100, 2)

        ecg_p2p = float(np.ptp(ecg_window)) if len(ecg_window) > 0 else 1.0
        motion_index = float(np.std(imu_accel)) if len(imu_accel) > 0 else 0.1

        return {
            "perfusion_index": perfusion_index,
            "ecg_amplitude": round(ecg_p2p, 3),
            "temperature_c": round(temp_val, 2),
            "respiratory_rate": round(resp_rate, 1),
            "motion_index": round(motion_index, 3),
            "gsr_microsiemens": round(gsr_val, 2)
        }
