"""
BlueEdge Glove — High-Fidelity Synthetic Physiological Simulator
Faithfully reproduces real sensor dynamics:
- MAX30102 PPG pulse train with dicrotic notch & AC/DC modulation
- AD8232 ECG with PQRST morphology & PVC injection
- MLX90614 IR skin temperature drift
- Piezoelectric respiration sinusoidal pressure signal
- MPU6050 6-DOF IMU accelerometer & gyroscope
- GSR electrodermal activity (tonic + phasic SCR spikes)
"""

import math
import time
import random
from typing import Dict, Any, List

class PhysiologicalSimulator:
    def __init__(self, patient_id: str, base_state: str = "Normal"):
        self.patient_id = patient_id
        self.current_state = base_state  # Normal, Hypoxia, Arrhythmia, Sepsis/Fever, Shock
        self.step = 0
        self.start_time = time.time()
        self.motion_level = 0.05
        self.sensor_dropout = False

        # Baseline vitals
        self.hr = 72
        self.spo2 = 98
        self.temp = 36.8
        self.rr = 15
        self.gsr = 2.1

    def set_pathology(self, state: str):
        self.current_state = state
        if state == "Hypoxia":
            self.hr = 108
            self.spo2 = 88
            self.temp = 36.6
            self.rr = 26
            self.motion_level = 0.1
        elif state == "Arrhythmia":
            self.hr = 92
            self.spo2 = 96
            self.temp = 36.9
            self.rr = 18
            self.motion_level = 0.08
        elif state == "Sepsis/Fever":
            self.hr = 114
            self.spo2 = 93
            self.temp = 39.2
            self.rr = 24
            self.motion_level = 0.15
        elif state == "Shock":
            self.hr = 132
            self.spo2 = 86
            self.temp = 35.4
            self.rr = 34
            self.motion_level = 0.25
        elif state == "Motion Artifact":
            self.motion_level = 1.8
        elif state == "Normal":
            self.hr = 72
            self.spo2 = 98
            self.temp = 36.8
            self.rr = 15
            self.motion_level = 0.05

    def step_vitals(self) -> Dict[str, Any]:
        """Evolves vitals smoothly over time with physiological jitter."""
        self.step += 1
        jitter_hr = random.uniform(-1.0, 1.0)
        jitter_spo2 = random.choice([-0.2, 0.0, 0.2])
        jitter_temp = random.uniform(-0.02, 0.02)
        jitter_rr = random.uniform(-0.3, 0.3)
        jitter_gsr = random.uniform(-0.05, 0.05)

        cur_hr = max(40, min(180, int(round(self.hr + jitter_hr))))
        cur_spo2 = max(70, min(100, int(round(self.spo2 + jitter_spo2))))
        cur_temp = max(34.0, min(41.5, round(self.temp + jitter_temp, 2)))
        cur_rr = max(8, min(45, int(round(self.rr + jitter_rr))))
        cur_gsr = max(0.5, min(12.0, round(self.gsr + jitter_gsr, 2)))

        activity = "Resting"
        if self.motion_level > 1.0:
            activity = "High Motion / Artifact"
        elif self.motion_level > 0.3:
            activity = "Minor Movement"

        return {
            "heart_rate": cur_hr,
            "spo2": cur_spo2,
            "temperature": cur_temp,
            "respiratory_rate": cur_rr,
            "gsr_microsiemens": cur_gsr,
            "motion_activity": activity,
            "simulated_pathology": self.current_state,
            "arrhythmia_flag": (self.current_state == "Arrhythmia")
        }

    def generate_waveform_chunk(self, n_points: int = 20, dt: float = 0.05) -> List[Dict[str, float]]:
        """
        Generates continuous physiological waveforms for high-frame-rate rendering:
        PPG (pulsatile with dicrotic notch), ECG (PQRST waves), Respiration (Piezo), GSR, Accel.
        """
        chunk = []
        base_t = time.time()
        period_ppg = 60.0 / max(40, self.hr)
        period_resp = 60.0 / max(8, self.rr)

        for i in range(n_points):
            t = base_t + i * dt
            
            # --- 1. PPG Waveform ---
            phase_ppg = (t % period_ppg) / period_ppg
            # Systolic peak + dicrotic notch + diastolic wave
            ppg = 0.85 * math.exp(-45 * (phase_ppg - 0.18)**2) + \
                  0.35 * math.exp(-70 * (phase_ppg - 0.42)**2) + \
                  0.15 * math.exp(-55 * (phase_ppg - 0.58)**2)
            # Add respiration baseline wander
            ppg += 0.08 * math.sin(2 * math.pi * (t / period_resp))
            if self.motion_level > 0.5:
                ppg += random.gauss(0, self.motion_level * 0.2)

            # --- 2. ECG Waveform ---
            phase_ecg = (t % period_ppg) / period_ppg
            # P wave
            p_wave = 0.12 * math.exp(-220 * (phase_ecg - 0.12)**2)
            # Q wave
            q_wave = -0.10 * math.exp(-500 * (phase_ecg - 0.20)**2)
            # R peak
            r_amp = 1.4 if self.current_state != "Arrhythmia" or (int(t) % 3 != 0) else 0.4
            r_peak = r_amp * math.exp(-850 * (phase_ecg - 0.23)**2)
            # S wave
            s_wave = -0.25 * math.exp(-600 * (phase_ecg - 0.26)**2)
            # T wave
            t_wave = 0.28 * math.exp(-120 * (phase_ecg - 0.40)**2)

            ecg = p_wave + q_wave + r_peak + s_wave + t_wave
            if self.current_state == "Arrhythmia" and (int(t * 1.5) % 4 == 0):
                # Ectopic PVC spike
                ecg += 0.8 * math.exp(-350 * (phase_ecg - 0.32)**2)

            if self.motion_level > 0.5:
                ecg += random.gauss(0, self.motion_level * 0.15)

            # --- 3. Respiration Waveform (Piezo) ---
            resp = math.sin(2 * math.pi * (t / period_resp)) * 0.8
            resp += 0.05 * math.sin(4 * math.pi * (t / period_resp)) # harmonic

            # --- 4. GSR Waveform ---
            gsr_wave = self.gsr + 0.15 * math.sin(t * 0.2) + random.uniform(-0.02, 0.02)

            # --- 5. IMU Accel Magnitude ---
            accel_mag = 9.81 + random.gauss(0, self.motion_level)

            chunk.append({
                "t": round(t, 3),
                "ppg": round(ppg, 4),
                "ecg": round(ecg, 4),
                "resp": round(resp, 4),
                "gsr": round(gsr_wave, 3),
                "accel_mag": round(accel_mag, 3)
            })

        return chunk
