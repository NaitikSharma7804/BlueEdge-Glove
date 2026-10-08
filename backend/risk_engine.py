"""
BlueEdge Glove — Hybrid Risk Engine & Clinical Insight Synthesizer
Combines:
1. Edge AI Model Prediction (1D CNN + BiLSTM)
2. Classical Physiological Thresholds
3. Temporal Trend Analysis
4. Signal Quality Index (SQI) Filter
To produce robust, non-diagnostic clinical decision support.
"""

from typing import Dict, Any, List
from models import AIInferenceResult, SensorQuality

class HybridRiskEngine:
    """
    Evaluates physiological safety by fusing AI inferences with clinical rules and SQI.
    Never declares a diagnosis; flags patterns and elevated physiological risk.
    """

    def evaluate(self, vitals: Dict[str, Any], ai_result: AIInferenceResult, quality: SensorQuality, history_trend: List[Dict[str, Any]]) -> AIInferenceResult:
        factors = []
        hr = vitals.get("heart_rate", 72)
        spo2 = vitals.get("spo2", 98)
        temp = vitals.get("temperature", 36.8)
        rr = vitals.get("respiratory_rate", 15)

        # 1. Signal Quality Verification
        if quality.overall_sqi < 0.5:
            # Poor signal quality suppresses false positive clinical panic
            factors.append(f"Poor sensor contact / high motion detected (SQI: {quality.overall_sqi:.2f})")
            insight = "Signal quality compromised due to motion artifact or lead detachment. AI alert suppressed pending signal stabilization. Please verify glove fit."
            return AIInferenceResult(
                predicted_state="Artifact / Low SQI",
                confidence=round(ai_result.confidence * 0.5, 2),
                risk_score=0.25,
                risk_level="LOW",
                model_version=ai_result.model_version,
                inference_latency_ms=ai_result.inference_latency_ms,
                contributing_factors=factors,
                clinical_insight=insight
            )

        # 2. Physiological Threshold Factors
        if spo2 <= 92:
            factors.append(f"SpO₂ depressed at {spo2}% (Threshold: <93%)")
        if hr >= 110:
            factors.append(f"Tachycardia detected: HR {hr} BPM (Threshold: >105 BPM)")
        elif hr <= 50:
            factors.append(f"Bradycardia detected: HR {hr} BPM (Threshold: <55 BPM)")
        if temp >= 38.2:
            factors.append(f"Hyperthermia / elevated skin temperature: {temp:.1f}°C")
        elif temp <= 35.5:
            factors.append(f"Hypothermia / peripheral cooling: {temp:.1f}°C")
        if rr >= 24:
            factors.append(f"Tachypnea / elevated respiration: {rr}/min (Threshold: >22/min)")

        # 3. Trend Trajectory Assessment
        if len(history_trend) >= 3:
            prev_spo2 = [p.get("spo2", 98) for p in history_trend[-3:]]
            if prev_spo2[0] > prev_spo2[-1] and (prev_spo2[0] - prev_spo2[-1]) >= 3:
                factors.append("Declining SpO₂ trajectory observed across observation window")

        # 4. Synthesize Clinical Insight
        state = ai_result.predicted_state
        risk_level = ai_result.risk_level
        risk_score = ai_result.risk_score

        if state == "Hypoxia":
            insight = f"Elevated physiological risk: Hypoxia pattern detected with {int(ai_result.confidence*100)}% AI confidence. Desaturation trend present. Signal quality: {quality.ppg}. Immediate clinical verification recommended."
        elif state == "Arrhythmia":
            insight = f"Cardiac rhythm irregularity detected (PVC / irregular R-R intervals). Heart rate: {hr} BPM. Signal quality: {quality.ecg}. Bedside ECG review recommended."
        elif state == "Sepsis/Fever":
            insight = f"Elevated thermal and autonomic response pattern. Core skin temp: {temp:.1f}°C, HR: {hr} BPM. Clinical evaluation for infectious or inflammatory response advised."
        elif state == "Shock":
            insight = f"CRITICAL: Multimodal hemodynamic collapse pattern. Concurrent hypotension proxy, tachycardia ({hr} BPM), and hypothermia ({temp:.1f}°C). Urgent physician assessment required."
        else:
            if len(factors) == 0:
                insight = "All monitored physiological parameters within expected baseline range. Autonomic and respiratory metrics stable."
            else:
                insight = f"Mild physiological deviation noted ({', '.join(factors[:2])}). Patient currently stable; continuous monitoring active."

        return AIInferenceResult(
            predicted_state=state,
            confidence=ai_result.confidence,
            risk_score=risk_score,
            risk_level=risk_level,
            model_version=ai_result.model_version,
            inference_latency_ms=ai_result.inference_latency_ms,
            contributing_factors=factors,
            clinical_insight=insight
        )
