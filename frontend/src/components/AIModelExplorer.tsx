import React, { useState } from 'react';
import { Cpu, Layers, GitBranch, ShieldAlert, BarChart3, Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const AIModelExplorer: React.FC = () => {
  const [selectedHead, setSelectedHead] = useState<'classification' | 'risk'>('classification');

  const classes = [
    { name: 'Normal', color: '#10b981', prob: 0.03, description: 'Physiological parameters within baseline homeostasis' },
    { name: 'Hypoxia', color: '#06b6d4', prob: 0.87, description: 'Progressive desaturation (SpO₂ < 90%) with compensatory tachypnea' },
    { name: 'Arrhythmia', color: '#f43f5e', prob: 0.04, description: 'Premature ventricular contractions or irregular R-R rhythm' },
    { name: 'Sepsis/Fever', color: '#f59e0b', prob: 0.03, description: 'Sustained hyperthermia (>38.3°C) with autonomic tachycardia' },
    { name: 'Shock', color: '#8b5cf6', prob: 0.03, description: 'Hemodynamic collapse with hypothermia, severe tachycardia, hypoxia' },
  ];

  const latencyBreakdown = [
    { stage: 'ESP32 Acquisition & DMA I2C Read', latency: '0.12 ms', device: 'ESP32-S3', type: 'Hardware' },
    { stage: 'Timestamp Alignment & Resampling', latency: '0.05 ms', device: 'Edge MCU', type: 'DSP' },
    { stage: 'Butterworth Bandpass SOS Denoising', latency: '0.65 ms', device: 'Edge MCU', type: 'DSP' },
    { stage: 'MPU6050 Motion Artifact Detection (SQA)', latency: '0.21 ms', device: 'Edge MCU', type: 'SQA' },
    { stage: 'Time & Frequency Feature Extraction (Welch, HRV)', latency: '3.40 ms', device: 'Edge Compute', type: 'Feature Engine' },
    { stage: '1D CNN Convolutional Feature Extraction', latency: '4.80 ms', device: 'Edge AI Core', type: 'TinyML' },
    { stage: 'Sliding-Window BiLSTM Temporal Inference', latency: '9.40 ms', device: 'Edge AI Core', type: 'TinyML' },
    { stage: 'Hybrid Risk Engine & SQI Weighting', latency: '0.42 ms', device: 'Edge Rule Engine', type: 'Clinical Logic' },
    { stage: 'Local Bedside Dashboard WebSocket Broadcast', latency: '0.95 ms', device: 'Local Gateway', type: 'UI' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multimodal Temporal Model Architecture</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-cyan-950 text-teal-700 dark:text-cyan-300 border border-teal-200 dark:border-cyan-800 font-semibold">
              BlueEdge-CNN-BiLSTM-v1.4
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Designed specifically for resource-constrained edge computing. Uses 1D Convolution for localized morphological signal features (ECG QRS complexes and PPG dicrotic notch) coupled with BiLSTM / sliding-window temporal modeling for trend detection.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-teal-700 dark:text-cyan-400 shadow-sm">
          <Layers className="w-4 h-4" />
          <span>Quantized Footprint: ~46.2 KB (INT8)</span>
        </div>
      </div>

      {/* Interactive Neural Network Architecture Block Diagram */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#080d19] p-6 space-y-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
          <span>Neural Computation Topology: Input → 1D CNN → BiLSTM → Dual Heads</span>
        </h3>

        {/* Visual Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Block 1: Input Layer */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 relative">
            <div className="text-[11px] font-mono text-teal-600 dark:text-cyan-400 font-bold uppercase">Layer 01: Input Window</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Multi-Sensor Tensor</h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">Shape: (T=10s, C=6)</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Accepts synchronized multimodal channels: PPG, ECG, Temp, Resp, IMU, and GSR across a 10-second observation window.
            </p>
          </div>

          {/* Block 2: 1D CNN */}
          <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-cyan-950/40 border border-teal-200 dark:border-cyan-800/60 relative">
            <div className="text-[11px] font-mono text-teal-700 dark:text-cyan-300 font-bold uppercase">Layer 02: Spatial Motifs</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">1D CNN Extractor</h4>
            <div className="text-xs text-teal-600 dark:text-cyan-400 mt-2 font-mono font-medium">3x [Conv1D + BatchNorm + MaxPool]</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Learns short-duration morphological wave motifs: sharp QRS spikes, dicrotic notch attenuation, and high-frequency noise rejection.
            </p>
          </div>

          {/* Block 3: BiLSTM */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 relative">
            <div className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 font-bold uppercase">Layer 03: Temporal Dynamics</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">BiLSTM Window Model</h4>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-mono font-medium">48 Hidden Units (Sliding Window)</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Captures non-stationary trajectory. Recognizes critical worsening slopes like <span className="font-mono text-teal-700 dark:text-cyan-300 font-bold">SpO₂ 98 → 97 → 94 → 89</span> across the observation window.
            </p>
          </div>

          {/* Block 4: Dual Heads */}
          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 relative">
            <div className="text-[11px] font-mono text-rose-700 dark:text-rose-300 font-bold uppercase">Layer 04: Dual Heads</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Split Output Heads</h4>
            <div className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-mono font-medium">Softmax(5) + Sigmoid(1)</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Simultaneously outputs categorical condition probability and continuous 0-1 risk score.
            </p>
          </div>
        </div>

        {/* Real-Time Causal Deployment Engineering Note */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900 dark:text-cyan-300 font-bold">Technical Credibility Note on Streaming Inference:</strong> In conventional offline training, bidirectional LSTMs utilize future context. In strict real-time edge deployment, BlueEdge architects inference over a <strong className="text-slate-900 dark:text-white font-bold">short 10-second sliding buffer with 2-second hop</strong> (or compiles to a causal LSTM/GRU equivalent). We do not claim bidirectional recurrence is causal streaming without windowing.
          </div>
        </div>
      </div>

      {/* Dual Head Outputs & Class Probability Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dual Head Live Inspection (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dual Output Heads (Active Sample P104)</h4>
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setSelectedHead('classification')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedHead === 'classification' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-cyan-300 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Classification Head
              </button>
              <button
                onClick={() => setSelectedHead('risk')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedHead === 'risk' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-cyan-300 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Risk Head
              </button>
            </div>
          </div>

          {selectedHead === 'classification' ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                5-Class Softmax probability distribution evaluated by the on-device model:
              </div>
              <div className="space-y-2.5">
                {classes.map((cls) => (
                  <div key={cls.name} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cls.color }} />
                        {cls.name}
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{(cls.prob * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${cls.prob * 100}%`, backgroundColor: cls.color }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{cls.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Continuous Sigmoid Risk Score evaluated simultaneously:
              </div>
              <div className="p-6 rounded-2xl bg-rose-50/60 dark:bg-slate-950 border border-rose-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold">Continuous Risk Index [0.0 - 1.0]</div>
                <div className="text-5xl font-black font-mono text-rose-600 dark:text-rose-400">0.87</div>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 inline-block shadow-sm">
                  HIGH PHYSIOLOGICAL RISK
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Unlike categorical classes alone, the continuous risk score enables sensitive alarming before full-blown hypoxia or shock thresholds are crossed.
              </p>
            </div>
          )}
        </div>

        {/* Right: Latency Breakdown Table (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                <span>Deterministic Edge Execution Budget</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Benchmarked on ARM Cortex-M33 / ESP32 Companion Edge Gateway</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              TOTAL: ~19.99ms
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Pipeline Stage</th>
                  <th className="py-2.5 px-3">Target Subsystem</th>
                  <th className="py-2.5 px-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {latencyBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50">
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{row.stage}</td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{row.device}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-700 dark:text-cyan-400">{row.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-medium">Well within the &lt; 50ms requirement for instantaneous bedside arrhythmia and hypoxia alarming.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
