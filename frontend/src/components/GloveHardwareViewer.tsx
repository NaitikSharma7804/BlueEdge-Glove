import React, { useState } from 'react';
import { Radio, Cpu, Activity, Thermometer, Wind, Zap, Shield, CheckCircle, Info } from 'lucide-react';

interface SensorInfo {
  id: string;
  name: string;
  location: string;
  signalType: string;
  samplingRate: string;
  interfaceBus: string;
  clinicalContribution: string;
  color: string;
  icon: any;
  liveReading: string;
  x: number; // percentage in glove diagram
  y: number;
}

export const GloveHardwareViewer: React.FC = () => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>('MAX30102');

  const sensors: SensorInfo[] = [
    {
      id: 'MAX30102',
      name: 'MAX30102 Pulse Oximeter & PPG',
      location: 'Index Fingertip (Landmark 8)',
      signalType: 'Dual Red (660nm) & Infrared (880nm) Photoplethysmogram',
      samplingRate: '100 Hz',
      interfaceBus: 'I2C (Address 0x57)',
      clinicalContribution: 'Measures continuous arterial oxygen saturation (SpO₂) via Beer-Lambert absorption and pulsatile heart rate. Extracts perfusion index and dicrotic notch timing.',
      color: '#06b6d4',
      icon: Activity,
      liveReading: 'SpO₂: 98% • HR: 72 BPM',
      x: 44,
      y: 16,
    },
    {
      id: 'MLX90614',
      name: 'MLX90614 Non-Contact IR Thermometer',
      location: 'Middle Fingertip (Landmark 12)',
      signalType: 'Infrared Thermopile (Factory Calibrated)',
      samplingRate: '10 Hz',
      interfaceBus: 'SMBus / I2C (Address 0x5A)',
      clinicalContribution: 'Measures continuous core skin surface temperature with 0.02°C resolution. Monitors for hyperthermia (sepsis/fever) and peripheral hypothermia (shock/vasoconstriction).',
      color: '#f59e0b',
      icon: Thermometer,
      liveReading: 'Skin Temp: 36.8°C',
      x: 58,
      y: 12,
    },
    {
      id: 'Piezo',
      name: 'Piezoelectric Dynamic Sensor',
      location: 'Ring Fingertip (Landmark 16)',
      signalType: 'Mechanical Strain / Thoracic Micro-vibration',
      samplingRate: '50 Hz',
      interfaceBus: 'Analog ADC (ESP32 GPIO 34)',
      clinicalContribution: 'Detects thoracic and peripheral volumetric respiration pulses. Measures respiration rate (RR) and flags shallow breathing, apnea, and tachypnea.',
      color: '#10b981',
      icon: Wind,
      liveReading: 'Resp: 15 /min',
      x: 72,
      y: 20,
    },
    {
      id: 'GSR',
      name: 'Galvanic Skin Response (GSR / EDA)',
      location: 'Little/Pinky Fingertip (Landmark 20)',
      signalType: 'Electrodermal Conductance (Tonic & Phasic SCR)',
      samplingRate: '50 Hz',
      interfaceBus: 'Analog ADC (ESP32 GPIO 35)',
      clinicalContribution: 'Monitors autonomic sympathetic nervous system tone and stress-induced eccrine sweat secretion. Critical for detecting acute pain, distress, and septic storm.',
      color: '#a855f7',
      icon: Zap,
      liveReading: 'Conductance: 2.1 µS',
      x: 84,
      y: 34,
    },
    {
      id: 'AD8232',
      name: 'AD8232 Single-Lead ECG Monitor',
      location: 'Thumb Tip & Palmar Thenar Contact (Landmark 4)',
      signalType: 'Biopotential Differential Voltage (P-Q-R-S-T Lead II)',
      samplingRate: '500 Hz',
      interfaceBus: 'Analog ADC (ESP32 GPIO 36) + Lead-Off Detect',
      clinicalContribution: 'Provides real-time cardiac electrical rhythm monitoring. Used by edge Pan-Tompkins algorithm to detect PVCs, atrial fibrillation, and ventricular arrhythmias.',
      color: '#f43f5e',
      icon: Activity,
      liveReading: 'Sinus Rhythm • R-R: 833ms',
      x: 22,
      y: 38,
    },
    {
      id: 'MPU6050',
      name: 'MPU6050 6-DOF IMU (Accel + Gyro)',
      location: 'Dorsal Wrist Enclosure (Landmark 0)',
      signalType: '3-Axis Accelerometer (±2g) + 3-Axis Gyroscope (±250°/s)',
      samplingRate: '50 Hz',
      interfaceBus: 'I2C (Address 0x68)',
      clinicalContribution: 'Quantifies patient physical tremor, posture, and gross motor activity. Crucial for Signal Quality Assessment (SQA): rejects false alarms caused by hand motion artifacts.',
      color: '#3b82f6',
      icon: Radio,
      liveReading: 'Resting • Accel: 1.01g',
      x: 52,
      y: 84,
    },
    {
      id: 'ESP32',
      name: 'ESP32-S3 Edge Gateway Microcontroller',
      location: 'Central Dorsal Metacarpal Enclosure',
      signalType: 'Dual-Core Xtensa LX7 @ 240MHz • 512KB SRAM • Wi-Fi/BLE',
      samplingRate: 'Synchronized Multi-Channel Acquisition',
      interfaceBus: 'System Master & Edge Telemetry Bridge',
      clinicalContribution: 'Handles multi-sensor I2C/ADC sampling, microsecond timestamp synchronization, local ring-buffering, and transfers packets to local edge compute / ML pipeline.',
      color: '#0ea5e9',
      icon: Cpu,
      liveReading: 'CPU: 18% • Free Heap: 294KB',
      x: 52,
      y: 54,
    },
  ];

  const selectedSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl border transition-all bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multimodal Sensing Glove Topology</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              Hardware Layer 1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            The BlueEdge Glove integrates 6 discrete clinical sensors into an ergonomic wearable glove. All physiological channels feed directly into an on-glove ESP32 microcontroller that performs microsecond timestamp synchronization and local buffering before edge inference.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">
          <Cpu className="w-4 h-4" />
          <span>I2C Bus + 12-bit ADC Synchronized</span>
        </div>
      </div>

      {/* Main Interactive Diagram & Info Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive Glove Schematic (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-slate-950 dark:bg-[#080d19] p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[520px] shadow-sm">
          {/* Subtle background tech grid */}
          <div className="absolute inset-0 opacity-15 ecg-grid pointer-events-none" />

          {/* SVG Glove Anatomical Silhouette */}
          <div className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center">
            <svg
              viewBox="0 0 400 500"
              className="w-full h-full drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Glove Body Path */}
              <path
                d="M 120 450 
                   C 120 400, 100 350, 90 280
                   C 80 230, 70 190, 80 160
                   C 88 135, 115 140, 125 180
                   C 135 220, 145 250, 150 250
                   C 155 240, 150 140, 160 80
                   C 168 35, 195 35, 205 80
                   C 215 130, 215 220, 220 220
                   C 225 210, 230 110, 240 60
                   C 248 20, 275 20, 285 60
                   C 295 110, 290 220, 295 220
                   C 300 210, 310 130, 320 90
                   C 328 60, 350 60, 355 100
                   C 362 150, 350 240, 355 240
                   C 360 230, 375 180, 385 160
                   C 395 140, 410 150, 405 180
                   C 395 240, 380 320, 360 380
                   C 340 430, 330 450, 310 470
                   L 120 450 Z"
                fill="#111827"
                stroke="#23334d"
                strokeWidth="2.5"
                className="opacity-90 transition-all"
              />

              {/* Glove Palm & Seam Accents */}
              <path
                d="M 130 270 Q 240 310 350 260"
                stroke="#1e293b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 170 330 Q 250 360 330 330"
                stroke="#1e293b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Hardware PCB Bus Lines connecting to ESP32 */}
              <path d="M 100 170 L 210 270" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 180 80 L 210 270" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 260 60 L 210 270" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 335 95 L 210 270" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 395 170 L 210 270" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 210 420 L 210 270" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </svg>

            {/* Interactive Sensor Nodes */}
            {sensors.map((sensor) => {
              const isSelected = selectedSensorId === sensor.id;
              const Icon = sensor.icon;
              return (
                <div
                  key={sensor.id}
                  onClick={() => setSelectedSensorId(sensor.id)}
                  style={{ top: `${sensor.y}%`, left: `${sensor.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg ${
                      isSelected
                        ? 'ring-4 ring-cyan-400/60 scale-125'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: sensor.color }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    {isSelected && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: sensor.color }}
                      />
                    )}
                  </div>

                  {/* Tooltip Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-slate-900/95 border border-slate-700 text-[10px] font-mono whitespace-nowrap text-white font-medium shadow-md pointer-events-none opacity-90 group-hover:opacity-100">
                    {sensor.id}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any sensor node above to inspect telemetry, hardware specs, and edge contribution</span>
          </div>
        </div>

        {/* Right Side: Sensor Specification Detail Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border p-6 space-y-4 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: selectedSensor.color }}
                >
                  <selectedSensor.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedSensor.name}</h3>
                  <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">{selectedSensor.location}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ACTIVE
              </span>
            </div>

            {/* Live Reading Tile */}
            <div className="p-3.5 rounded-xl border flex items-center justify-between bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Current Edge Ingestion:</span>
              <span className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-300">{selectedSensor.liveReading}</span>
            </div>

            {/* Technical Specs List */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-mono">MEASUREMENT PRINCIPLE & SIGNAL</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">{selectedSensor.signalType}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-mono">SAMPLING RATE</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono mt-0.5 block">{selectedSensor.samplingRate}</span>
                </div>
                <div className="p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-mono">INTERFACE BUS</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold font-mono mt-0.5 block">{selectedSensor.interfaceBus}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-mono">EDGE AI & CLINICAL RELEVANCE</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                  {selectedSensor.clinicalContribution}
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Reminder */}
          <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 text-xs text-cyan-800 dark:text-cyan-200 flex items-start gap-2">
            <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Local Acquisition:</strong> Sensor signals are ingested directly into the glove's ESP32 DMA buffers. Raw waveforms are processed locally by the companion edge MCU without requiring continuous cloud upload.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
