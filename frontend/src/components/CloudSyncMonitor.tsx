import React, { useState } from 'react';
import { Cloud, CloudOff, RefreshCw, Database, Shield, Lock, ArrowDown, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { CloudSyncStats } from '../types';

interface CloudSyncMonitorProps {
  stats: CloudSyncStats;
  isOnline: boolean;
  onToggleOnline: () => void;
  onFlushBuffer: () => void;
}

export const CloudSyncMonitor: React.FC<CloudSyncMonitorProps> = ({
  stats,
  isOnline,
  onToggleOnline,
  onFlushBuffer,
}) => {
  const [selectedPayloadTab, setSelectedPayloadTab] = useState<'sample' | 'schema'>('sample');

  const sampleJson = {
    patient_id: "P104",
    timestamp: 1728345620.14,
    heart_rate: 121,
    spo2: 89,
    temperature: 38.7,
    respiratory_rate: 29,
    risk_score: 0.87,
    risk_level: "HIGH",
    predicted_state: "Hypoxia",
    signal_quality: "GOOD",
    overall_sqi: 0.88,
    model_version: "BlueEdge-CNN-BiLSTM-v1.4",
    event_type: "RISK_ALERT",
    signature: "hmac-sha256:8f4c2e... (Device Authenticated)"
  };

  return (
    <div className="space-y-6">
      {/* Resilience Banner */}
      <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
        isOnline
          ? 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800'
          : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80 ring-2 ring-rose-500/20 dark:ring-rose-500/40'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Cloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Selective Cloud Synchronization Layer</h2>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                    Online • Synchronizing Summaries
                  </span>
                </>
              ) : (
                <>
                  <CloudOff className="w-5 h-5 text-rose-500 dark:text-rose-400 animate-pulse" />
                  <h2 className="text-lg font-bold text-rose-800 dark:text-rose-300">Edge Active / Cloud Offline</h2>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-semibold">
                    Resilient Edge Mode (Buffering Locally)
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-medium">
              {isOnline
                ? 'The cloud acts as an asynchronous archive and synchronization layer. The edge transmits compact clinical JSON payloads while raw high-frequency waveforms remain on local edge storage.'
                : 'Internet connectivity has been suspended. Notice that local edge inference, sensor acquisition, real-time waveform monitors, and bedside alarms CONTINUE TO OPERATE NORMALLY. State summaries are safely queued in the local edge buffer.'}
            </p>
          </div>

          {/* Offline / Online Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleOnline}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                isOnline
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20'
              }`}
            >
              {isOnline ? 'Simulate Network Outage (Go Offline)' : 'Restore Internet Connection (Go Online)'}
            </button>

            {!isOnline && stats.buffered_events_count > 0 && (
              <button
                onClick={onFlushBuffer}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 dark:bg-cyan-950 text-teal-800 dark:text-cyan-300 border border-teal-200 dark:border-cyan-700/80 hover:bg-teal-100 dark:hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Flush Buffer Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Telemetry Metrics & Bandwidth Reduction Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Raw Data Processed Locally */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono font-bold">Raw Data Processed Locally</div>
          <div className="text-2xl font-bold font-mono text-teal-700 dark:text-cyan-400">
            {stats.raw_data_processed_kb.toLocaleString()} KB
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">500Hz ECG + 100Hz PPG digitized locally</div>
        </div>

        {/* Cloud Sync Transmitted */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono font-bold">Selective Cloud Synced</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {stats.cloud_sync_transmitted_kb.toFixed(1)} KB
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Summarized clinical events & trends only</div>
        </div>

        {/* Bandwidth Reduction */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1 shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono font-bold">Bandwidth Reduction</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
            {stats.bandwidth_reduction_pct.toFixed(2)}%
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-medium">&gt; 100x network traffic conservation</div>
        </div>

        {/* Local Buffer Queue */}
        <div className={`p-4 rounded-2xl border space-y-1 shadow-sm ${
          stats.buffered_events_count > 0 
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60' 
            : 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800'
        }`}>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono font-bold">Offline Local Buffer Queue</div>
          <div className={`text-2xl font-bold font-mono ${stats.buffered_events_count > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-300'}`}>
            {stats.buffered_events_count} events
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {stats.buffered_events_count > 0 ? 'Awaiting cloud link restoration' : 'Buffer synchronized'}
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel & JSON Payload Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Data Reduction Flow Funnel (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Edge Data Filtration Funnel</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">How thousands of raw analog samples compress to clinical knowledge</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">1. Continuous Raw Biopotentials</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">500Hz ECG, 100Hz PPG, Resp, IMU, GSR</div>
              </div>
              <span className="font-bold text-rose-600 dark:text-rose-400">~480 kbps / patient</span>
            </div>

            <div className="flex justify-center text-teal-600 dark:text-cyan-500">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div>
                <div className="font-bold text-teal-700 dark:text-cyan-300">2. Local Feature Extraction & SQA</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">HRV, Perfusion, FFT Bands, Motion Rejection</div>
              </div>
              <span className="font-bold text-teal-700 dark:text-cyan-400">48 floats / window</span>
            </div>

            <div className="flex justify-center text-teal-600 dark:text-cyan-500">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">3. Local Edge AI & Hybrid Risk Engine</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">1D CNN + BiLSTM Inference + Bedside Alert</div>
              </div>
              <span className="font-bold text-teal-700 dark:text-cyan-400">&lt; 15 ms Local Latency</span>
            </div>

            <div className="flex justify-center text-emerald-600 dark:text-emerald-500">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <div>
                <div className="font-bold text-emerald-800 dark:text-emerald-300">4. Selective Cloud Synchronization</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">Only critical events and 5s summaries</div>
              </div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">~140 bytes / packet</span>
            </div>
          </div>
        </div>

        {/* Right: Actual Serialized Telemetry JSON (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                <span>Synchronized Payload Format</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">What actually gets transmitted over TLS 1.3</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <Lock className="w-3 h-3" />
              <span>TLS 1.3 / HMAC</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 dark:bg-[#060a12] border border-slate-800 font-mono text-xs text-teal-300 dark:text-emerald-300/90 whitespace-pre leading-relaxed overflow-x-auto max-h-[300px] shadow-inner">
            {JSON.stringify(sampleJson, null, 2)}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 shadow-sm">
            <Shield className="w-4 h-4 text-teal-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium">
              <strong className="text-slate-900 dark:text-white font-bold">Cryptographic Integrity & Audit:</strong> Each selective packet includes a device HMAC signature and sequential sequence ID. If communication drops, the local SQLite database preserves packets in order with zero clinical record loss.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
