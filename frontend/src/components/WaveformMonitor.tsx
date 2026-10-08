import React, { useEffect, useRef, useState } from 'react';
import { WaveformPoint } from '../types';
import { Play, Pause, RefreshCw, ZoomIn, Info, Activity } from 'lucide-react';

interface WaveformMonitorProps {
  waveforms: WaveformPoint[];
  heartRate: number;
  spo2: number;
  patientId: string;
}

export const WaveformMonitor: React.FC<WaveformMonitorProps> = ({
  waveforms,
  heartRate,
  spo2,
  patientId,
}) => {
  const [timebase, setTimebase] = useState<'1s' | '10s' | '30s' | '1m' | '5m'>('10s');
  const [activeLead, setActiveLead] = useState<'ALL' | 'ECG' | 'PPG' | 'RESP' | 'GSR' | 'IMU'>('ALL');
  const [isPaused, setIsPaused] = useState(false);

  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ppgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const respCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gsrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Buffer history for rendering
  const historyRef = useRef<WaveformPoint[]>([]);

  useEffect(() => {
    if (isPaused) return;
    if (waveforms && waveforms.length > 0) {
      historyRef.current = [...historyRef.current, ...waveforms].slice(-300);
    }
  }, [waveforms, isPaused]);

  // Smooth oscilloscope rendering loop
  useEffect(() => {
    let animationFrameId: number;

    const renderLead = (
      canvas: HTMLCanvasElement | null,
      color: string,
      getValue: (pt: WaveformPoint) => number,
      minVal: number,
      maxVal: number
    ) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark clinical background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Draw faint medical grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const data = historyRef.current;
      if (data.length < 2) return;

      // Draw waveform trace
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      const step = width / (data.length - 1);
      data.forEach((pt, idx) => {
        const val = getValue(pt);
        const norm = (val - minVal) / (maxVal - minVal || 1);
        const y = height - Math.max(0.05, Math.min(0.95, norm)) * height;
        const x = idx * step;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    const draw = () => {
      renderLead(ecgCanvasRef.current, '#f43f5e', (pt) => pt.ecg, -0.6, 1.8);
      renderLead(ppgCanvasRef.current, '#06b6d4', (pt) => pt.ppg, 0.0, 1.3);
      renderLead(respCanvasRef.current, '#10b981', (pt) => pt.resp, -1.0, 1.0);
      renderLead(gsrCanvasRef.current, '#a855f7', (pt) => pt.gsr, 0.5, 6.0);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="rounded-2xl border p-6 space-y-4 transition-all bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Local Physiological Waveform Monitor</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              Edge-Buffered (No Cloud Streaming)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-lead oscilloscope rendered directly from local edge MCU buffer
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timebase Window */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
            {(['1s', '10s', '30s', '1m', '5m'] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTimebase(tb)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  timebase === tb
                    ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tb}
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isPaused
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Sweep' : 'Freeze'}</span>
          </button>
        </div>
      </div>

      {/* Waveforms Stack */}
      <div className="space-y-3">
        {/* Lead 1: ECG (AD8232) */}
        {(activeLead === 'ALL' || activeLead === 'ECG') && (
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#080d1a]">
            <div className="absolute top-2 left-3 z-10 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-rose-400 tracking-wider">LEAD II (AD8232 ECG)</span>
              <span className="text-[10px] text-slate-400 font-mono">500 Hz • Pan-Tompkins R-Peak Detect</span>
              <span className="text-xs font-mono font-bold text-rose-400">{heartRate} BPM</span>
            </div>
            <canvas ref={ecgCanvasRef} width={1000} height={110} className="w-full h-28 block" />
          </div>
        )}

        {/* Lead 2: PPG (MAX30102) */}
        {(activeLead === 'ALL' || activeLead === 'PPG') && (
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#080d1a]">
            <div className="absolute top-2 left-3 z-10 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">PPG PLETHYSMOGRAM (MAX30102)</span>
              <span className="text-[10px] text-slate-400 font-mono">100 Hz • IR/Red Ratio • Dicrotic Notch</span>
              <span className="text-xs font-mono font-bold text-cyan-400">SpO₂: {spo2}%</span>
            </div>
            <canvas ref={ppgCanvasRef} width={1000} height={100} className="w-full h-24 block" />
          </div>
        )}

        {/* Lead 3: Respiration (Piezo) */}
        {(activeLead === 'ALL' || activeLead === 'RESP') && (
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#080d1a]">
            <div className="absolute top-2 left-3 z-10 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">RESPIRATORY EXPANSION (Piezo)</span>
              <span className="text-[10px] text-slate-400 font-mono">Thoracic Pressure Wave • 50 Hz</span>
            </div>
            <canvas ref={respCanvasRef} width={1000} height={80} className="w-full h-20 block" />
          </div>
        )}

        {/* Lead 4: GSR (Electrodermal Activity) */}
        {(activeLead === 'ALL' || activeLead === 'GSR') && (
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#080d1a]">
            <div className="absolute top-2 left-3 z-10 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-purple-400 tracking-wider">ELECTRODERMAL ACTIVITY (GSR)</span>
              <span className="text-[10px] text-slate-400 font-mono">Skin Conductance Response (Tonic + Phasic)</span>
            </div>
            <canvas ref={gsrCanvasRef} width={1000} height={70} className="w-full h-18 block" />
          </div>
        )}
      </div>

      {/* Engineering Privacy & Bandwidth Notice */}
      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Local Inspection Principle:</strong> High-bandwidth continuous waveforms (500Hz ECG, 100Hz PPG) are rendered directly from the local ESP32 edge buffer for bedside inspection. <span className="text-cyan-300">These raw continuous waveforms are NOT uploaded to the cloud</span>, saving over 99% bandwidth and preserving strict physiological privacy.
        </div>
      </div>
    </div>
  );
};
