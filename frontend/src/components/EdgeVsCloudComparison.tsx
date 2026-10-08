import React, { useState } from 'react';
import { Shield, Zap, AlertTriangle, CheckCircle2, ArrowRight, Cloud, Cpu, Lock, Radio, Server, WifiOff } from 'lucide-react';

export const EdgeVsCloudComparison: React.FC = () => {
  const [activeSimulation, setActiveSimulation] = useState<'normal' | 'outage'>('normal');

  return (
    <div className="space-y-6">
      {/* Narrative Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">The BlueEdge Paradigm Shift</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-cyan-950 text-teal-700 dark:text-cyan-300 border border-teal-200 dark:border-cyan-800 font-semibold">
              Edge-First vs Traditional Cloud IoT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Continuous raw-data transmission to distant data centers exposes sensitive patient data, introduces network latency, and fails completely during connectivity dropouts. BlueEdge moves the primary intelligence layer to the patient.
          </p>
        </div>

        {/* Network Outage Simulator Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
          <button
            onClick={() => setActiveSimulation('normal')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSimulation === 'normal'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Normal Network
          </button>
          <button
            onClick={() => setActiveSimulation('outage')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSimulation === 'outage'
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Simulate Internet Drop / Outage
          </button>
        </div>
      </div>

      {/* Side-by-Side Architectural Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Traditional Cloud-Centric IoT */}
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-gradient-to-b from-rose-50/60 to-white dark:from-rose-950/10 dark:to-slate-900/90 p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/30">
            <div>
              <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">Traditional Paradigm</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Cloud-Centric Telemetry</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 shadow-sm">
              Continuous Cloud Dependency
            </span>
          </div>

          {/* Architecture Chain */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <span>Sensors (MAX30102, ECG, Temp)</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">500 Hz Raw Stream</span>
            </div>
            <div className="text-center text-slate-400 dark:text-slate-600 font-bold">↓</div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <span>ESP32 Gateway (Dumb Relay)</span>
              <span className="text-slate-500 dark:text-slate-400">Zero Local Intelligence</span>
            </div>
            <div className="text-center text-slate-400 dark:text-slate-600 font-bold">↓ Continuous Wi-Fi / WAN Upload</div>
            <div className={`p-2.5 rounded-xl border transition-all ${
              activeSimulation === 'outage'
                ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-400 text-rose-900 dark:text-rose-200 animate-pulse'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <span>Internet / Remote Cloud Core</span>
                <span className="font-bold">{activeSimulation === 'outage' ? 'DISCONNECTED (FAILURE)' : '~850ms Roundtrip'}</span>
              </div>
              {activeSimulation === 'outage' && (
                <div className="text-[11px] text-rose-700 dark:text-rose-300 mt-1 font-sans font-medium">
                  CRITICAL: When the cloud link breaks, alarms STOP functioning. No doctor alerts can be evaluated!
                </div>
              )}
            </div>
            <div className="text-center text-slate-400 dark:text-slate-600 font-bold">↓ Remote Inference Result</div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <span>Doctor / Bedside Monitor</span>
              <span className="text-slate-500 dark:text-slate-400">Delayed Alerts</span>
            </div>
          </div>

          {/* Limitations List */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span><strong>Excessive Continuous Bandwidth:</strong> Transmits thousands of raw biopotential samples every second (~480 kbps per bed).</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span><strong>Severe Latency Jitter:</strong> Network hops and cloud queueing delay acute arrhythmia alarms by 600ms - 2,500ms.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span><strong>Broad Exposure of Raw Data:</strong> Unfiltered physiological streams travel continuously across public backbones.</span>
            </div>
          </div>
        </div>

        {/* Right Column: BlueEdge Edge-First Monitoring */}
        <div className="rounded-2xl border border-teal-200 dark:border-cyan-800/60 bg-gradient-to-b from-teal-50/50 to-white dark:from-cyan-950/20 dark:to-slate-900/90 p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-teal-100 dark:border-cyan-800/40">
            <div>
              <span className="text-[10px] font-mono text-teal-700 dark:text-cyan-400 font-bold uppercase tracking-wider">BlueEdge Paradigm</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Edge-First Intelligence Layer</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-cyan-950 text-teal-800 dark:text-cyan-300 border border-teal-200 dark:border-cyan-700/60 shadow-sm">
              Zero Cloud Dependency
            </span>
          </div>

          {/* Architecture Chain */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <span>Sensors (MAX30102, ECG, Temp, GSR...)</span>
              <span className="text-teal-700 dark:text-cyan-400 font-bold">500 Hz DMA Acquisition</span>
            </div>
            <div className="text-center text-teal-600 dark:text-cyan-500 font-bold">↓ Microsecond Hardware Synchronized</div>
            <div className="p-2.5 rounded-xl bg-teal-50/80 dark:bg-cyan-950/40 border border-teal-200 dark:border-cyan-800/60 text-slate-800 dark:text-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-800 dark:text-cyan-300">On-Device Edge Preprocessing & SQA</span>
                <span className="text-teal-700 dark:text-cyan-400 font-semibold">~1.2 ms</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-sans mt-0.5">
                Butterworth filtering, motion artifact rejection, and signal quality validation.
              </div>
            </div>
            <div className="text-center text-teal-600 dark:text-cyan-500 font-bold">↓ Zero Raw Data Leaves Device</div>
            <div className="p-2.5 rounded-xl bg-teal-100/70 dark:bg-cyan-950/60 border border-teal-300 dark:border-cyan-500/60 text-slate-900 dark:text-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 dark:text-white">Edge AI (1D CNN + BiLSTM) & Risk Engine</span>
                <span className="text-teal-800 dark:text-cyan-400 font-bold">~14.8 ms (Local)</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans mt-0.5">
                Instantaneous local risk evaluation & immediate bedside buzzer/display alert.
              </div>
            </div>
            <div className="text-center text-emerald-600 dark:text-emerald-500 font-bold">↓ Doctor Alerted Locally (Instantaneous)</div>
            <div className={`p-2.5 rounded-xl border transition-all ${
              activeSimulation === 'outage'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/80 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">Selective Cloud Synchronization</span>
                <span className="font-medium">{activeSimulation === 'outage' ? 'Buffered Locally (Zero Data Loss)' : '140-byte Periodic Summary'}</span>
              </div>
              <div className="text-[11px] font-sans mt-0.5 text-slate-600 dark:text-slate-300">
                {activeSimulation === 'outage'
                  ? 'Cloud offline: System continues 100% operation. Events buffered in local flash memory until reconnected.'
                  : 'Cloud acts as long-term archive & coordination, not the real-time processing brain.'}
              </div>
            </div>
          </div>

          {/* Advantages List */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Sub-20ms Deterministic Latency:</strong> Local edge inference guarantees immediate life-critical alarming.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>99.5% Bandwidth Reduction:</strong> Transmits ~1.2 kbps of clinical state rather than 480 kbps of raw biopotentials.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Reduced Raw-Data Exposure:</strong> Sensitive biopotentials remain local. Only authorized clinical summaries synchronize.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantitative Engineering Benchmark Comparison Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
          <span>Engineering Metric Comparison</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Evaluation Metric</th>
                <th className="py-2.5 px-3 text-rose-600 dark:text-rose-400">Traditional Cloud IoT</th>
                <th className="py-2.5 px-3 text-teal-700 dark:text-cyan-400">BlueEdge Edge-First</th>
                <th className="py-2.5 px-3 text-right">Engineering Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr>
                <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">Alert Latency</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono">600 ms – 1,800 ms (Network dependent)</td>
                <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-cyan-300 font-mono">&lt; 20 ms (Deterministic)</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">97% faster response</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">Continuous Network Bandwidth</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono">~480 kbps / patient</td>
                <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-cyan-300 font-mono">~1.2 kbps / patient (Selective)</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">&gt; 99.5% reduction</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">Offline Resilience</td>
                <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">Total blackout when offline</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Full standalone inference + local alerts</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">Zero data loss</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">Raw Data Privacy Exposure</td>
                <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">Raw waveforms traverse external networks</td>
                <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-cyan-300">Raw waveforms remain on local device buffer</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">Minimized attack surface</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
