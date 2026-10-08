import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldCheck, Cpu, Sliders, Database, Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface PipelineStage {
  id: number;
  name: string;
  shortLabel: string;
  category: 'acquisition' | 'dsp' | 'sqa' | 'ai' | 'clinical' | 'sync';
  description: string;
  inputFormat: string;
  outputFormat: string;
  processingDetails: string;
  sampleData: string;
  latencyUs: string;
}

export const EdgePipelineVisualizer: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<number>(7); // Default to Edge AI stage

  const stages: PipelineStage[] = [
    {
      id: 1,
      name: '1. Multi-Sensor Acquisition',
      shortLabel: 'Acquisition',
      category: 'acquisition',
      description: 'ESP32 reads 6 sensors synchronously over I2C and high-speed DMA ADC.',
      inputFormat: 'Raw I2C bytes (MAX30102, MLX90614, MPU6050) & ADC voltage samples (AD8232, Piezo, GSR)',
      outputFormat: 'Uncalibrated discrete integer buffers [0-4095 ADC, 18-bit PPG registers]',
      processingDetails: 'Interrupt-driven timer triggers ADC conversions at 500Hz for ECG and reads FIFO buffers of MAX30102 at 100Hz without blocking the main CPU loop.',
      sampleData: 'raw_ecg = [2048, 2092, 2140, 2380, 1890, 2045...]\nraw_ppg_ir = [184320, 184512, 184980, 184120...]',
      latencyUs: '120 µs / packet',
    },
    {
      id: 2,
      name: '2. Timestamp Synchronization',
      shortLabel: 'Timestamping',
      category: 'acquisition',
      description: 'Microsecond clock alignment across heterogenous sensor sample rates (10Hz to 500Hz).',
      inputFormat: 'Asynchronous sensor streams with individual clock drifts',
      outputFormat: 'Synchronized temporal frames with epoch timestamps (µs resolution)',
      processingDetails: 'Hardware hardware timers generate uniform time anchors; cubic spline resamples signals to uniform 100Hz/500Hz shared temporal grid.',
      sampleData: 'frame_t0 = { t_us: 1728345600124500, ecg_sample: 2048, ppg_sample: 184320, imu_acc_z: 9.81 }',
      latencyUs: '45 µs',
    },
    {
      id: 3,
      name: '3. Noise Filtering & Preprocessing',
      shortLabel: 'Noise Filter',
      category: 'dsp',
      description: 'Bandpass Butterworth filtering to eliminate 50/60Hz mains hum and baseline wander.',
      inputFormat: 'Noisy raw sensor waveforms containing 50Hz AC powerline noise & DC baseline drift',
      outputFormat: 'Zero-phase filtered biopotential signals (ECG: 0.5-40Hz, PPG: 0.5-4.0Hz)',
      processingDetails: 'Second-Order Sections (SOS) Butterworth filter computed using fixed-point CMSIS-DSP arithmetic on ARM Cortex-M or optimized C++ on ESP32 LX7.',
      sampleData: 'sos_ecg = [[0.046, 0.092, 0.046, 1.0, -1.31, 0.53], ...]\necg_filt = signal.sosfilt(sos, raw_ecg)',
      latencyUs: '650 µs',
    },
    {
      id: 4,
      name: '4. Motion Artifact Detection',
      shortLabel: 'Artifact Detect',
      category: 'dsp',
      description: 'Cross-references MPU6050 6-DOF IMU acceleration variance against PPG & ECG baseline fluctuations.',
      inputFormat: 'Filtered ECG/PPG alongside IMU 3-axis accelerometer and gyroscope vectors',
      outputFormat: 'Binary artifact masks & variance metric for motion corruption',
      processingDetails: 'Calculates dynamic L2 norm variance of accelerometer: Var(||a - a_mean||). If motion exceeds 0.40g², flags prospective signal degradation to prevent false clinical tachycardia or hypoxia alarms.',
      sampleData: 'accel_mag_var = 0.082 g² (< 0.40g² threshold) -> Status: NO_ARTIFACT',
      latencyUs: '210 µs',
    },
    {
      id: 5,
      name: '5. Missing-Value Handling & Normalization',
      shortLabel: 'Normalization',
      category: 'dsp',
      description: 'Handles packet drops and standardizes dynamic range for neural network consumption.',
      inputFormat: 'Windowed signal arrays with possible dropped samples',
      outputFormat: 'Zero-mean, unit-variance standardized physiological tensors [-3.0 to +3.0]',
      processingDetails: 'Linear forward imputation for dropped ADC samples (< 2 consecutive points). Z-score normalization: x_norm = (x - mean) / (std + 1e-6).',
      sampleData: 'ppg_norm = [-0.12, 0.45, 1.89, -0.62, 0.04...]\necg_norm = [-0.05, 1.42, -0.21, 0.35...]',
      latencyUs: '380 µs',
    },
    {
      id: 6,
      name: '6. Signal Quality Assessment (SQA / SQI)',
      shortLabel: 'SQA Engine',
      category: 'sqa',
      description: 'Computes multi-channel Signal Quality Index: GOOD / DEGRADED / POOR.',
      inputFormat: 'Normalized signals, Pan-Tompkins peak consistency, perfusion index',
      outputFormat: 'Categorical SQI (GOOD/DEGRADED/POOR) and continuous SQI score (0.00-1.00)',
      processingDetails: 'Weighted combination of Perfusion Index (PI = AC/DC * 100), R-peak kurtosis, skewness, and IMU stability score. If SQI < 0.50, downstream AI suppresses clinical alarms.',
      sampleData: 'SQI_overall = 0.94 (GOOD)\nPPG_SQI: GOOD (Perfusion: 4.2%)\nECG_SQI: GOOD (SNR: 24.1 dB)',
      latencyUs: '820 µs',
    },
    {
      id: 7,
      name: '7. Edge Feature Extraction',
      shortLabel: 'Features',
      category: 'dsp',
      description: 'Calculates time-domain, frequency-domain, and physiological features across 10s sliding window.',
      inputFormat: '10-second multi-sensor window (1000 PPG points, 5000 ECG points, IMU, Temp, GSR)',
      outputFormat: 'Compact 48-dimensional physiological feature vector',
      processingDetails: 'Extracts HRV metrics (SDNN, RMSSD, pNN50, LF/HF proxy), Welch spectral power density bands, Beer-Lambert SpO₂ AC/DC ratio, respiratory rate from amplitude modulation, and GSR SCR peaks.',
      sampleData: 'vector = [SDNN: 48.2ms, RMSSD: 34.1ms, SpO2: 89.2%, RR: 29.1/min, Welch_HF: 0.42, GSR: 6.2µS...]',
      latencyUs: '3.4 ms',
    },
    {
      id: 8,
      name: '8. Edge AI Model (1D CNN + BiLSTM)',
      shortLabel: 'Edge AI',
      category: 'ai',
      description: 'Multimodal temporal deep neural network deployed locally on Edge Gateway/Companion compute.',
      inputFormat: 'Extracted feature vector OR sliding-window physiological tensor',
      outputFormat: 'Dual Head: 5-class condition softmax probabilities + continuous risk score [0-1]',
      processingDetails: '1D CNN extracts local morphological motifs (QRS morphology, dicrotic notch). BiLSTM (or sliding-window causal temporal recurrent cells) captures trend trajectory. Quantized to INT8/FP16 (46KB TFLite footprint).',
      sampleData: 'Softmax: [Normal: 0.03, Hypoxia: 0.87, Arrhythmia: 0.04, Sepsis: 0.03, Shock: 0.03]\nRisk Head: 0.87 (HIGH RISK)\nInference Latency: 14.2 ms',
      latencyUs: '14.2 ms',
    },
    {
      id: 9,
      name: '9. Hybrid Risk Engine & Clinical Synthesizer',
      shortLabel: 'Risk Engine',
      category: 'clinical',
      description: 'Fuses Edge AI output with clinical physiological thresholds, temporal slope, and SQI.',
      inputFormat: 'AI prediction + Current Vitals (HR, SpO2, Temp, RR) + SQI rating',
      outputFormat: 'Triage categorization (STABLE, WARNING, CRITICAL) + Non-diagnostic clinical insight',
      processingDetails: 'Integrates expert clinical boundaries: SpO2 < 90% + HR > 120 triggers critical risk escalation even if AI confidence is moderate. Verifies that SQI is not POOR before sounding bedside buzzer.',
      sampleData: 'Result: HIGH RISK\nClinical Insight: "Elevated physiological risk: Hypoxia pattern detected with 87% AI confidence. Clinical verification recommended."',
      latencyUs: '420 µs',
    },
    {
      id: 10,
      name: '10. Selective Cloud Synchronization',
      shortLabel: 'Selective Sync',
      category: 'sync',
      description: 'Transmits compact clinical summary JSON to remote cloud; raw data stays at the edge.',
      inputFormat: 'Evaluated clinical event, patient metadata, aggregated statistics',
      outputFormat: 'Ultra-compact 140-byte serialized JSON packet via TLS 1.3 (or local buffer if offline)',
      processingDetails: 'Pushes only risk events, state changes, or 5-second aggregated summaries. If internet is down, automatically stores in local encrypted buffer for zero-loss catch-up when reconnected.',
      sampleData: '{\n  "patient_id": "P104",\n  "hr": 121, "spo2": 89, "temp": 38.7,\n  "risk_score": 0.87, "state": "Hypoxia",\n  "sqi": 0.88, "model_ver": "v1.4"\n}',
      latencyUs: '1.2 ms (TLS push) / 0.1 ms (local buffer)',
    },
  ];

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edge Processing Pipeline (Interactive Visualizer)</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-cyan-950 text-teal-700 dark:text-cyan-300 border border-teal-200 dark:border-cyan-800 font-semibold">
              Sense Locally → Process Locally → Alert Locally
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Watch how raw multimodal sensor signals are acquired, cleaned, validated by SQI, and evaluated by the Edge AI model—all before deciding whether to selectively synchronize with the cloud.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-xl font-semibold shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Raw Data Stays On-Premise</span>
        </div>
      </div>

      {/* Horizontal Interactive Step Flow */}
      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1c] border border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none shadow-sm">
        <div className="flex items-center gap-2 min-w-[950px] justify-between py-2">
          {stages.map((stage, idx) => {
            const isSelected = activeStageId === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setActiveStageId(stage.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all flex-1 min-w-[85px] border ${
                    isSelected
                      ? 'bg-teal-600 dark:bg-cyan-950/80 border-teal-700 dark:border-cyan-400 text-white shadow-md shadow-teal-500/20 dark:shadow-cyan-950 ring-2 ring-teal-500/30 dark:ring-cyan-400/50 scale-105 font-bold'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold mb-1 ${isSelected ? 'text-teal-100 dark:text-cyan-300' : 'text-teal-600 dark:text-cyan-400'}`}>0{stage.id}</span>
                  <span className="text-xs font-semibold text-center leading-tight">{stage.shortLabel}</span>
                  <span className={`text-[9px] font-mono mt-1 ${isSelected ? 'text-teal-100 dark:text-slate-300' : 'text-slate-400'}`}>{stage.latencyUs}</span>
                </button>
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detailed Mechanics & Formulation (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-teal-600 dark:text-cyan-400 font-bold tracking-wider">
                Stage {currentStage.id} of {stages.length}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentStage.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Latency: <strong className="text-teal-700 dark:text-cyan-300">{currentStage.latencyUs}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {currentStage.description}
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold block">MATHEMATICAL / ALGORITHMIC IMPLEMENTATION:</span>
              <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed font-sans">
                {currentStage.processingDetails}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold block">STAGE INPUT:</span>
                <span className="text-slate-700 dark:text-slate-300 mt-1 block font-mono text-[11px] break-words">{currentStage.inputFormat}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold block">STAGE OUTPUT:</span>
                <span className="text-teal-700 dark:text-cyan-300 mt-1 block font-mono text-[11px] font-medium break-words">{currentStage.outputFormat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Concrete Edge Data Payload Inspector (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                <span>Edge Memory Buffer Inspector</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                Local RAM
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Actual memory buffer contents passing through this stage on the edge processor:
            </div>

            {/* Code / Data Block */}
            <div className="p-3.5 rounded-xl bg-slate-950 dark:bg-[#060a12] border border-slate-800 font-mono text-[11px] text-teal-300 dark:text-cyan-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[260px] shadow-inner">
              {currentStage.sampleData}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cumulative Edge Latency:</span>
            <span className="font-mono font-bold text-teal-700 dark:text-cyan-400 text-sm">~14.8 ms (Local Edge Total)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
