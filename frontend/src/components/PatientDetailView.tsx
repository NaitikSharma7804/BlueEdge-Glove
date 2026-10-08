import React from 'react';
import { Patient, WaveformPoint, PathologyType, TimelineEvent } from '../types';
import { WaveformMonitor } from './WaveformMonitor';
import { 
  Heart, Activity, Thermometer, Wind, Zap, Shield, AlertTriangle, 
  CheckCircle2, Clock, Info, Stethoscope, LogOut, Check
} from 'lucide-react';

interface PatientDetailViewProps {
  patient: Patient;
  waveforms: WaveformPoint[];
  history: TimelineEvent[];
  onInjectPathology: (patientId: string, pathology: PathologyType) => void;
  onSelectPatient: (patientId: string) => void;
  allPatients: Patient[];
  onOpenDischargeModal: (patient: Patient) => void;
  isDark: boolean;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  waveforms,
  history,
  onInjectPathology,
  onSelectPatient,
  allPatients,
  onOpenDischargeModal,
  isDark,
}) => {
  const riskPercent = Math.round(patient.ai_analysis.risk_score * 100);
  const confPercent = Math.round(patient.ai_analysis.confidence * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Patient Header Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl font-mono text-xl font-extrabold flex items-center justify-center ${
              isDark ? 'bg-slate-800 text-cyan-400' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            }`}>
              {patient.id}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{patient.name}</h2>
                {patient.is_discharged ? (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    Patient OUT (Discharged)
                  </span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    patient.status === 'Critical'
                      ? isDark ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-200'
                      : patient.status === 'Warning'
                      ? isDark ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200'
                      : isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {patient.status} Priority (Patient IN)
                  </span>
                )}
              </div>
              <div className={`text-xs mt-1 flex items-center gap-2 flex-wrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="font-semibold">{patient.bed}</span>
                <span>•</span>
                <span>{patient.age}y ({patient.gender})</span>
                <span>•</span>
                <span>Admission: <strong className="opacity-90">{patient.admission_reason}</strong></span>
                <span>•</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">{patient.glove_id || 'BE-GLOVE-01'}</span>
              </div>
            </div>
          </div>

          {/* Controls: Bed Switcher, Pathology Injector & Discharge Button */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Patient Switcher */}
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="px-1.5 font-medium opacity-70">Switch:</span>
              <select
                value={patient.id}
                onChange={(e) => onSelectPatient(e.target.value)}
                className={`font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name} {p.is_discharged ? '(OUT)' : `(${p.status})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Pathology Injector */}
            {!patient.is_discharged && (
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {(['Normal', 'Hypoxia', 'Arrhythmia', 'Sepsis/Fever', 'Shock'] as PathologyType[]).map((pathology) => (
                  <button
                    key={pathology}
                    onClick={() => onInjectPathology(patient.id, pathology)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                      isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title={`Simulate ${pathology}`}
                  >
                    {pathology}
                  </button>
                ))}
              </div>
            )}

            {/* Discharge Action Button (Patient OUT) */}
            {!patient.is_discharged ? (
              <button
                onClick={() => onOpenDischargeModal(patient)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Discharge (Patient OUT)</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Discharged on {patient.discharged_at || '10:45 AM'}
              </div>
            )}
          </div>
        </div>

        {/* Discharged Notice Banner */}
        {patient.is_discharged && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Patient Discharged:</strong> {patient.discharge_disposition || 'Discharged Home'}. {patient.discharge_notes || 'All vitals stabilized.'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Glove Released for Sterilization</span>
          </div>
        )}
      </div>

      {/* Primary Vitals Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Heart Rate */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>HEART RATE</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono flex items-baseline gap-1">
            <span>{patient.vitals.heart_rate}</span>
            <span className="text-xs opacity-60 font-normal">BPM</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            SQI: <span className="text-emerald-500 font-bold">{patient.quality.ecg}</span>
          </div>
        </div>

        {/* SpO2 */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SpO₂ SATURATION</span>
            <Activity className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 flex items-baseline gap-1">
            <span>{patient.vitals.spo2}</span>
            <span className="text-xs opacity-60 font-normal">%</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            SQI: <span className="text-emerald-500 font-bold">{patient.quality.ppg}</span>
          </div>
        </div>

        {/* Skin Temp */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SKIN TEMP</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono flex items-baseline gap-1">
            <span>{patient.vitals.temperature.toFixed(1)}</span>
            <span className="text-xs opacity-60 font-normal">°C</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">MLX90614 IR</div>
        </div>

        {/* Respiration */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>RESPIRATION</span>
            <Wind className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono flex items-baseline gap-1">
            <span>{patient.vitals.respiratory_rate}</span>
            <span className="text-xs opacity-60 font-normal">/min</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Piezo Effort</div>
        </div>

        {/* GSR */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>GSR / EDA</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black font-mono flex items-baseline gap-1">
            <span>{patient.vitals.gsr_microsiemens.toFixed(1)}</span>
            <span className="text-xs opacity-60 font-normal">µS</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Autonomic Tone</div>
        </div>

        {/* Motion Activity */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ACTIVITY (IMU)</span>
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-bold mt-2 truncate">
            {patient.vitals.motion_activity}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">MPU6050 6-DOF</div>
        </div>
      </div>

      {/* Multi-lead Oscilloscope Monitor */}
      <WaveformMonitor
        waveforms={waveforms}
        heartRate={patient.vitals.heart_rate}
        spo2={patient.vitals.spo2}
        patientId={patient.id}
      />

      {/* Decision Support & Explainability Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Risk Gauge & Classification Card */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 space-y-5 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-500" />
                <span>Edge AI Risk Assessment</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">{patient.ai_analysis.model_version}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
              patient.ai_analysis.risk_level === 'CRITICAL' || patient.ai_analysis.risk_level === 'HIGH'
                ? isDark ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-50 text-rose-700 border border-rose-200'
                : patient.ai_analysis.risk_level === 'MODERATE'
                ? isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200'
                : isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {patient.ai_analysis.risk_level} RISK
            </span>
          </div>

          {/* Continuous Risk Score Gauge */}
          <div className={`p-5 rounded-2xl border text-center space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-mono uppercase text-slate-500">Continuous Risk Score [0.0 - 1.0]</span>
            <div className="text-4xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              {patient.ai_analysis.risk_score.toFixed(2)}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  riskPercent > 70 ? 'bg-rose-500' : riskPercent > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${riskPercent}%` }}
              />
            </div>
          </div>

          {/* Predicted Physiological State */}
          <div className={`p-4 rounded-xl border space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Predicted Condition:</span>
              <span className="font-bold text-sm">{patient.ai_analysis.predicted_state}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Model Classification Confidence:</span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{confPercent}%</span>
            </div>
          </div>
        </div>

        {/* Right: "Why this Alert?" Clinical Explainability */}
        <div className={`lg:col-span-7 rounded-2xl border p-6 space-y-4 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Clinical Explainability: Why this Assessment?</span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
              Multimodal temporal features and physiological rules contributing to this risk level
            </p>
          </div>

          {/* Insight Synthesis Box */}
          <div className={`p-4 rounded-xl border space-y-1.5 ${
            isDark ? 'bg-slate-950 border-cyan-900/40 text-slate-200' : 'bg-cyan-50/50 border-cyan-200 text-slate-800'
          }`}>
            <span className="text-[11px] font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold">
              SYNTHESIZED CLINICAL INSIGHT
            </span>
            <p className="text-xs leading-relaxed font-medium">
              {patient.ai_analysis.clinical_insight}
            </p>
          </div>

          {/* Contributing Factors */}
          <div className="space-y-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px] uppercase block">CONTRIBUTING FACTORS:</span>
            {patient.ai_analysis.contributing_factors.length > 0 ? (
              patient.ai_analysis.contributing_factors.map((factor, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>{factor}</span>
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 italic">
                All extracted features conform to resting baseline ranges. No adverse trends detected.
              </div>
            )}
          </div>

          <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs text-slate-500 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Decision Support Disclaimer:</strong> BlueEdge provides real-time physiological pattern analysis. It does not replace independent medical diagnosis by a licensed physician.
            </span>
          </div>
        </div>
      </div>

      {/* Patient History Audit Timeline */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Patient Telemetric Audit Timeline</span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
              Chronological record of admissions, vital transitions, risk alerts, and discharge events
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">{history.length} logged events</span>
        </div>

        <div className="mt-4 space-y-2.5">
          {history.map((ev, idx) => {
            const badgeColor =
              ev.status === 'Critical'
                ? isDark ? 'text-rose-400 bg-rose-950/80 border-rose-800' : 'text-rose-700 bg-rose-50 border-rose-200'
                : ev.status === 'Warning'
                ? isDark ? 'text-amber-400 bg-amber-950/80 border-amber-800' : 'text-amber-700 bg-amber-50 border-amber-200'
                : isDark ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

            return (
              <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-cyan-700'
                }`}>
                  {ev.timestamp}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                  {ev.status}
                </span>
                <span className="opacity-90 flex-1 leading-relaxed">{ev.event}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
