import React from 'react';
import { Activity, Cpu, Cloud, CloudOff, Shield, Radio, Layers, Stethoscope, Sun, Moon, UserPlus } from 'lucide-react';
import { AppMode, ThemeMode } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  bufferedCount: number;
  edgeLatency: number;
  bandwidthSaved: number;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenAdmitModal: () => void;
  activeCount: number;
  dischargedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  isOnline,
  setIsOnline,
  bufferedCount,
  edgeLatency,
  bandwidthSaved,
  theme,
  setTheme,
  onOpenAdmitModal,
  activeCount,
  dischargedCount,
}) => {
  const isDark = theme !== 'light';

  const tabs = [
    { id: 'dashboard', label: 'Doctor Dashboard', icon: Stethoscope },
    { id: 'patient', label: 'Patient Telemetry', icon: Activity },
    { id: 'hardware', label: 'Glove Hardware', icon: Radio },
    { id: 'pipeline', label: 'Edge Pipeline', icon: Layers },
    { id: 'model', label: 'AI Model Architecture', icon: Cpu },
    { id: 'differentiator', label: 'Edge vs Cloud', icon: Shield },
    { id: 'sync', label: 'Cloud Sync & Buffer', icon: isOnline ? Cloud : CloudOff },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
      isDark
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md'
        : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-sm backdrop-blur-md'
    }`}>
      {/* Top Telemetry & Architecture Notification Bar */}
      <div className={`px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b ${
        isDark ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-50 border-slate-200/60 text-slate-600'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping inline-block"></span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">BLUEEDGE PLATFORM:</span>
            <span className="font-mono hidden md:inline opacity-80">
              Sense locally → Process locally → Analyze locally → Alert locally → Synchronize selectively
            </span>
          </div>
        </div>

        {/* Global Controls & Metrics */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Census Badges (In / Out) */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className={`px-2 py-0.5 rounded-full font-bold ${
              isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              IN: {activeCount}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${
              isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              OUT: {dischargedCount}
            </span>
          </div>

          {/* Edge Latency */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>Edge Latency: <strong className="text-cyan-600 dark:text-cyan-400">{edgeLatency.toFixed(1)}ms</strong></span>
          </div>

          {/* Bandwidth Savings */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono border ${
            isDark ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Saved: <strong>{bandwidthSaved}%</strong></span>
          </div>

          {/* Offline / Online Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold border transition-all ${
              isOnline
                ? isDark
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 hover:bg-slate-750'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-rose-500 text-white border-rose-600 animate-pulse'
            }`}
            title="Toggle network connectivity to test offline edge resilience"
          >
            {isOnline ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cloud Sync: ON</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5" />
                <span>OFFLINE (Buf: {bufferedCount})</span>
              </>
            )}
          </button>

          {/* Mode Switcher */}
          <div className={`flex items-center rounded-lg p-0.5 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['SIMULATION', 'LIVE_HARDWARE', 'RESEARCH'] as AppMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  mode === m
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'SIMULATION' ? 'Simulation' : m === 'LIVE_HARDWARE' ? 'Live HW' : 'Research'}
              </button>
            ))}
          </div>

          {/* Theme Switcher Toggle (Dark Palettes) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'midnight' : 'dark')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-500/60 transition-all shadow-sm"
            title="Toggle Dark Theme Palette (Obsidian / Midnight)"
          >
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider">{theme === 'dark' ? 'Obsidian' : 'Midnight'}</span>
          </button>
        </div>
      </div>

      {/* Main Branding & Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">
                BlueEdge <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Glove</span>
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
              }`}>
                Edge-AI v1.4
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} hidden sm:block font-medium`}>
              Gesture-Controlled Offline Patient Monitoring System • ESP32 + Multimodal Edge Intelligence
            </p>
          </div>
        </div>

        {/* Action Button: Patient IN (Admit Patient) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdmitModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Admit Patient (IN)</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'opacity-60'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
