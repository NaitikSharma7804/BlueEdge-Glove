import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDetailView } from './components/PatientDetailView';
import { GloveHardwareViewer } from './components/GloveHardwareViewer';
import { EdgePipelineVisualizer } from './components/EdgePipelineVisualizer';
import { AIModelExplorer } from './components/AIModelExplorer';
import { EdgeVsCloudComparison } from './components/EdgeVsCloudComparison';
import { CloudSyncMonitor } from './components/CloudSyncMonitor';
import { AdmitPatientModal } from './components/AdmitPatientModal';
import { DischargePatientModal } from './components/DischargePatientModal';

import { Patient, WaveformPoint, CloudSyncStats, AppMode, PathologyType, TimelineEvent, ThemeMode } from './types';
import { INITIAL_PATIENTS, INITIAL_TIMELINES } from './services/dataService';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mode, setMode] = useState<AppMode>('SIMULATION');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>('dark'); // Deep Obsidian Cyber Dark (no white background)

  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P104');
  const [waveforms, setWaveforms] = useState<WaveformPoint[]>([]);
  const [timelines, setTimelines] = useState<Record<string, TimelineEvent[]>>(INITIAL_TIMELINES);

  // Modal States
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [patientToDischarge, setPatientToDischarge] = useState<Patient | null>(null);

  const [syncStats, setSyncStats] = useState<CloudSyncStats>({
    internet_connected: true,
    cloud_sync_active: true,
    buffered_events_count: 0,
    raw_data_processed_kb: 12480.0,
    cloud_sync_transmitted_kb: 48.6,
    bandwidth_reduction_pct: 99.61,
    recent_syncs: [],
  });

  const isDark = theme !== 'light';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const activePatients = patients.filter((p) => !p.is_discharged);
  const dischargedPatients = patients.filter((p) => p.is_discharged);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) ||
    activePatients[0] ||
    patients[0];

  // High-Resolution Waveform & Telemetry Engine
  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackInterval: number;

    const setupWebSocket = () => {
      try {
        ws = new WebSocket('ws://localhost:8000/ws');
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'TELEMETRY_UPDATE') {
              if (data.sync_stats) setSyncStats(data.sync_stats);
            }
          } catch (err) {
            console.error('Error parsing WS message:', err);
          }
        };

        ws.onerror = () => startInternalSimulation();
        ws.onclose = () => startInternalSimulation();
      } catch (e) {
        startInternalSimulation();
      }
    };

    const startInternalSimulation = () => {
      if (fallbackInterval) clearInterval(fallbackInterval);

      fallbackInterval = window.setInterval(() => {
        const now = Date.now() / 1000;
        const hr = selectedPatient?.vitals?.heart_rate || 72;
        const rr = selectedPatient?.vitals?.respiratory_rate || 15;
        const periodEcg = 60.0 / Math.max(40, hr);
        const periodResp = 60.0 / Math.max(8, rr);

        const newPoints: WaveformPoint[] = [];
        for (let i = 0; i < 6; i++) {
          const t = now + i * 0.04;
          const phaseEcg = (t % periodEcg) / periodEcg;
          const phaseResp = (t % periodResp) / periodResp;

          // ECG PQRST synthesis
          const p = 0.12 * Math.exp(-220 * Math.pow(phaseEcg - 0.12, 2));
          const q = -0.10 * Math.exp(-500 * Math.pow(phaseEcg - 0.20, 2));
          const isPVC = selectedPatient?.ai_analysis?.predicted_state === 'Arrhythmia' && Math.floor(t * 1.5) % 4 === 0;
          const rAmp = isPVC ? 0.5 : 1.4;
          const r = rAmp * Math.exp(-850 * Math.pow(phaseEcg - 0.23, 2));
          const s = -0.25 * Math.exp(-600 * Math.pow(phaseEcg - 0.26, 2));
          const twave = 0.28 * Math.exp(-120 * Math.pow(phaseEcg - 0.40, 2));
          const ecg = p + q + r + s + twave + (isPVC ? 0.7 * Math.exp(-350 * Math.pow(phaseEcg - 0.32, 2)) : 0);

          // PPG plethysmogram synthesis (dicrotic notch)
          const phasePpg = phaseEcg;
          const ppg = 0.85 * Math.exp(-45 * Math.pow(phasePpg - 0.18, 2)) +
                      0.35 * Math.exp(-70 * Math.pow(phasePpg - 0.42, 2)) +
                      0.15 * Math.exp(-55 * Math.pow(phasePpg - 0.58, 2)) +
                      0.06 * Math.sin(2 * Math.PI * phaseResp);

          // Respiration wave
          const resp = Math.sin(2 * Math.PI * phaseResp) * 0.8;

          // GSR & Accel
          const gsr = (selectedPatient?.vitals?.gsr_microsiemens || 2.1) + 0.1 * Math.sin(t * 0.2);
          const accel = 9.81 + (Math.random() - 0.5) * 0.05;

          newPoints.push({
            t,
            ecg: Number(ecg.toFixed(3)),
            ppg: Number(ppg.toFixed(3)),
            resp: Number(resp.toFixed(3)),
            gsr: Number(gsr.toFixed(2)),
            accel_mag: Number(accel.toFixed(2)),
          });
        }

        setWaveforms(newPoints);

        // Update selective sync counters
        setSyncStats((prev) => {
          const rawProcessed = prev.raw_data_processed_kb + 1.2;
          let synced = prev.cloud_sync_transmitted_kb;
          let buffered = prev.buffered_events_count;

          if (isOnline) {
            synced += 0.02;
          } else {
            buffered += 1;
          }

          const reduction = Math.max(0, ((rawProcessed - synced) / rawProcessed) * 100);
          return {
            ...prev,
            raw_data_processed_kb: rawProcessed,
            cloud_sync_transmitted_kb: synced,
            buffered_events_count: buffered,
            bandwidth_reduction_pct: Number(reduction.toFixed(2)),
          };
        });
      }, 250);
    };

    setupWebSocket();

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [selectedPatientId, isOnline, selectedPatient?.vitals?.heart_rate, selectedPatient?.vitals?.respiratory_rate, selectedPatient?.ai_analysis?.predicted_state]);

  // Handle Pathology Injection
  const handleInjectPathology = (patientId: string, pathology: PathologyType) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;

        let hr = 72;
        let spo2 = 98;
        let temp = 36.8;
        let rr = 15;
        let gsr = 2.1;
        let status: 'Stable' | 'Warning' | 'Critical' = 'Stable';
        let riskScore = 0.05;
        let riskLevel: any = 'LOW';
        let conf = 0.94;
        let factors: string[] = [];
        let insight = 'Physiological parameters within baseline homeostasis.';

        if (pathology === 'Hypoxia') {
          hr = 121;
          spo2 = 89;
          temp = 38.7;
          rr = 29;
          gsr = 6.2;
          status = 'Critical';
          riskScore = 0.87;
          riskLevel = 'HIGH';
          conf = 0.87;
          factors = ['SpO₂ declined 98% → 89%', 'Tachycardia 121 BPM', 'Tachypnea 29/min', 'Worsening temporal trend'];
          insight = 'HIGH RISK: Hypoxia pattern detected with 87% AI confidence. Rapid desaturation trend observed over observation window. Clinical verification recommended.';
        } else if (pathology === 'Arrhythmia') {
          hr = 112;
          spo2 = 95;
          temp = 36.9;
          rr = 19;
          gsr = 3.1;
          status = 'Warning';
          riskScore = 0.58;
          riskLevel = 'MODERATE';
          conf = 0.89;
          factors = ['Frequent irregular R-R intervals', 'Tachycardia 112 BPM'];
          insight = 'Arrhythmia pattern detected. Irregular ventricular intervals noted on AD8232 lead. Bedside rhythm strip review recommended.';
        } else if (pathology === 'Sepsis/Fever') {
          hr = 106;
          spo2 = 94;
          temp = 38.8;
          rr = 22;
          gsr = 4.8;
          status = 'Warning';
          riskScore = 0.61;
          riskLevel = 'MODERATE';
          conf = 0.84;
          factors = ['Core temp 38.8°C', 'Tachycardia (106 BPM)', 'Elevated skin conductance'];
          insight = 'Elevated thermal and autonomic response pattern. Hyperthermia and tachycardia detected. Sepsis workup suggested.';
        } else if (pathology === 'Shock') {
          hr = 134;
          spo2 = 87;
          temp = 35.3;
          rr = 33;
          gsr = 7.9;
          status = 'Critical';
          riskScore = 0.94;
          riskLevel = 'CRITICAL';
          conf = 0.92;
          factors = ['Severe tachycardia 134 BPM', 'Hypothermia 35.3°C', 'Hypoxemia 87%', 'Elevated sympathetic tone'];
          insight = 'CRITICAL: Multimodal hemodynamic decompensation pattern. Concurrent hypothermia, severe tachycardia, and tachypnea. Urgent clinical assessment required.';
        }

        return {
          ...p,
          status,
          vitals: {
            ...p.vitals,
            heart_rate: hr,
            spo2,
            temperature: temp,
            respiratory_rate: rr,
            gsr_microsiemens: gsr,
          },
          ai_analysis: {
            ...p.ai_analysis,
            predicted_state: pathology === 'Normal' ? 'Normal' : pathology,
            confidence: conf,
            risk_score: riskScore,
            risk_level: riskLevel,
            contributing_factors: factors,
            clinical_insight: insight,
          },
          last_update: Date.now(),
        };
      })
    );

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimelines((prev) => ({
      ...prev,
      [patientId]: [
        ...(prev[patientId] || []),
        {
          timestamp: timeStr,
          status: pathology === 'Hypoxia' || pathology === 'Shock' ? 'Critical' : pathology === 'Normal' ? 'Stable' : 'Warning',
          event: `Simulated condition transition: ${pathology} pattern injected into edge inference buffer.`,
        },
      ],
    }));
  };

  // Handle Patient IN (Admission)
  const handleAdmitPatient = (patientData: {
    name: string;
    bed: string;
    age: number;
    gender: string;
    admissionReason: string;
    pathology: PathologyType;
    gloveId: string;
  }) => {
    const newId = `P${100 + patients.length + 1}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPatient: Patient = {
      id: newId,
      name: patientData.name,
      bed: patientData.bed,
      age: patientData.age,
      gender: patientData.gender,
      admission_reason: patientData.admissionReason,
      status: patientData.pathology === 'Hypoxia' || patientData.pathology === 'Shock' ? 'Critical' : patientData.pathology === 'Normal' ? 'Stable' : 'Warning',
      vitals: {
        heart_rate: patientData.pathology === 'Hypoxia' ? 120 : 72,
        spo2: patientData.pathology === 'Hypoxia' ? 89 : 98,
        temperature: patientData.pathology === 'Sepsis/Fever' ? 38.9 : 36.8,
        respiratory_rate: 16,
        gsr_microsiemens: 2.2,
        motion_activity: 'Resting',
      },
      quality: { ppg: 'GOOD', ecg: 'GOOD', temp: 'GOOD', resp: 'GOOD', imu: 'GOOD', gsr: 'GOOD', overall_sqi: 0.95 },
      ai_analysis: {
        predicted_state: patientData.pathology,
        confidence: 0.92,
        risk_score: patientData.pathology === 'Normal' ? 0.05 : 0.72,
        risk_level: patientData.pathology === 'Normal' ? 'LOW' : 'HIGH',
        model_version: 'BlueEdge-CNN-BiLSTM-v1.4',
        inference_latency_ms: 14.1,
        contributing_factors: [],
        clinical_insight: `Patient admitted to ${patientData.bed}. Continuous telemetry active via ${patientData.gloveId}.`,
      },
      last_update: Date.now(),
      is_discharged: false,
      admitted_at: nowStr,
      glove_id: patientData.gloveId,
    };

    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newId);

    setTimelines((prev) => ({
      ...prev,
      [newId]: [
        {
          timestamp: nowStr,
          status: 'Stable',
          event: `Patient IN: Admitted to ${patientData.bed}. BlueEdge Glove ${patientData.gloveId} coupled for continuous telemetry.`,
        },
      ],
    }));

    setActiveTab('patient');
  };

  // Handle Patient OUT (Discharge)
  const handleConfirmDischarge = (patientId: string, disposition: string, notes: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          is_discharged: true,
          discharged_at: nowStr,
          discharge_disposition: disposition,
          discharge_notes: notes,
        };
      })
    );

    setTimelines((prev) => ({
      ...prev,
      [patientId]: [
        ...(prev[patientId] || []),
        {
          timestamp: nowStr,
          status: 'Stable',
          event: `Patient OUT: Discharged. Disposition: ${disposition}. Notes: ${notes}. BlueEdge Glove uncoupled.`,
        },
      ],
    }));
  };

  const handleFlushBuffer = () => {
    setSyncStats((prev) => ({
      ...prev,
      buffered_events_count: 0,
      cloud_sync_transmitted_kb: prev.cloud_sync_transmitted_kb + prev.buffered_events_count * 0.14,
    }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${
      isDark ? 'dark cyber-bg text-slate-100 selection:bg-cyan-500/30' : 'bg-slate-900 text-slate-100 selection:bg-cyan-500/30'
    }`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        bufferedCount={syncStats.buffered_events_count}
        edgeLatency={selectedPatient?.ai_analysis?.inference_latency_ms || 14.2}
        bandwidthSaved={syncStats.bandwidth_reduction_pct}
        theme={theme}
        setTheme={setTheme}
        onOpenAdmitModal={() => setIsAdmitModalOpen(true)}
        activeCount={activePatients.length}
        dischargedCount={dischargedPatients.length}
      />

      {/* Main Content Area */}
      <main className="max-w-[1700px] w-full mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DoctorDashboard
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={(p) => {
              setSelectedPatientId(p.id);
              setActiveTab('patient');
            }}
            onInjectPathology={handleInjectPathology}
            onOpenAdmitModal={() => setIsAdmitModalOpen(true)}
            onOpenDischargeModal={(p) => {
              setPatientToDischarge(p);
              setIsDischargeModalOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {activeTab === 'patient' && (
          <PatientDetailView
            patient={selectedPatient}
            waveforms={waveforms}
            history={timelines[selectedPatient.id] || []}
            onInjectPathology={handleInjectPathology}
            onSelectPatient={(id) => setSelectedPatientId(id)}
            allPatients={patients}
            onOpenDischargeModal={(p) => {
              setPatientToDischarge(p);
              setIsDischargeModalOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {activeTab === 'hardware' && <GloveHardwareViewer />}

        {activeTab === 'pipeline' && <EdgePipelineVisualizer />}

        {activeTab === 'model' && <AIModelExplorer />}

        {activeTab === 'differentiator' && <EdgeVsCloudComparison />}

        {activeTab === 'sync' && (
          <CloudSyncMonitor
            stats={syncStats}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            onFlushBuffer={handleFlushBuffer}
          />
        )}
      </main>

      {/* Admit Patient Modal (Patient IN) */}
      <AdmitPatientModal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        onAdmit={handleAdmitPatient}
        isDark={isDark}
      />

      {/* Discharge Patient Modal (Patient OUT) */}
      <DischargePatientModal
        isOpen={isDischargeModalOpen}
        onClose={() => {
          setIsDischargeModalOpen(false);
          setPatientToDischarge(null);
        }}
        patient={patientToDischarge}
        onConfirmDischarge={handleConfirmDischarge}
        isDark={isDark}
      />

      {/* Footer */}
      <footer className={`border-t py-4 text-xs transition-colors ${
        isDark ? 'border-slate-800 bg-slate-950 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-[1700px] mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">BlueEdge Glove Architecture</span>
            <span>•</span>
            <span>Multimodal Sensing (MAX30102, MLX90614, MPU6050, Piezo, AD8232, GSR) → Local ESP32 → Edge 1D CNN-BiLSTM → Selective Sync</span>
          </div>
          <div className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
            Census: {activePatients.length} Patients IN • {dischargedPatients.length} Patients OUT
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
