import React, { useState } from 'react';
import { Patient, PathologyType } from '../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, Activity, ChevronRight, Filter, Zap, UserPlus, LogOut, Search, Clock, ArrowRight } from 'lucide-react';

interface DoctorDashboardProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onInjectPathology: (patientId: string, pathology: PathologyType) => void;
  onOpenAdmitModal: () => void;
  onOpenDischargeModal: (patient: Patient) => void;
  isDark: boolean;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onInjectPathology,
  onOpenAdmitModal,
  onOpenDischargeModal,
  isDark,
}) => {
  const [censusTab, setCensusTab] = useState<'IN' | 'OUT'>('IN');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Stable' | 'Warning' | 'Critical'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const activePatients = patients.filter((p) => !p.is_discharged);
  const dischargedPatients = patients.filter((p) => p.is_discharged);

  const stableCount = activePatients.filter((p) => p.status === 'Stable').length;
  const warningCount = activePatients.filter((p) => p.status === 'Warning').length;
  const criticalCount = activePatients.filter((p) => p.status === 'Critical').length;

  const currentList = censusTab === 'IN' ? activePatients : dischargedPatients;

  const filteredPatients = currentList.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Monitored */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white shadow-lg shadow-black/20'
            : 'bg-white border-slate-200/80 text-slate-900 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Active Patients (IN)
              </div>
              <div className="text-3xl font-extrabold mt-1 text-cyan-600 dark:text-cyan-400">
                {activePatients.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3 text-cyan-500" /> Continuous Edge Monitoring
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Stable Telemetry */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Stable' ? 'ALL' : 'Stable')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Stable'
              ? 'ring-2 ring-emerald-500 border-emerald-500'
              : ''
          } ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-emerald-700/60'
              : 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                Stable Telemetry
              </div>
              <div className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">
                {stableCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Normal physiological baseline</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Physiological Warning */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Warning' ? 'ALL' : 'Warning')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Warning'
              ? 'ring-2 ring-amber-500 border-amber-500'
              : ''
          } ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-amber-700/60'
              : 'bg-white border-slate-200/80 hover:border-amber-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                Warning Risk
              </div>
              <div className="text-3xl font-extrabold mt-1 text-amber-600 dark:text-amber-400">
                {warningCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Elevated risk pattern detected</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Critical Triage */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Critical' ? 'ALL' : 'Critical')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Critical'
              ? 'ring-2 ring-rose-500 border-rose-500'
              : ''
          } ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-rose-700/60'
              : 'bg-white border-slate-200/80 hover:border-rose-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400">
                Critical Priority
              </div>
              <div className="text-3xl font-extrabold mt-1 text-rose-600 dark:text-rose-400">
                {criticalCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Urgent doctor attention needed</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Census & Filter Controls Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* In / Out Primary Toggle */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setCensusTab('IN')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                censusTab === 'IN'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Active Patients (IN)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
                {activePatients.length}
              </span>
            </button>
            <button
              onClick={() => setCensusTab('OUT')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                censusTab === 'OUT'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Discharged (OUT)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {dischargedPatients.length}
              </span>
            </button>
          </div>

          {/* Status Sub-Filters */}
          {censusTab === 'IN' && (
            <div className={`flex items-center p-1 rounded-xl border text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {(['ALL', 'Critical', 'Warning', 'Stable'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    statusFilter === filter
                      ? isDark
                        ? 'bg-slate-800 text-cyan-400'
                        : 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Name, or Bed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-3 py-1.5 rounded-xl border text-xs font-medium w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Action Button: Patient IN */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdmitModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit New Patient (Patient IN)</span>
          </button>
        </div>
      </div>

      {/* Main Clinical Table */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>{censusTab === 'IN' ? 'Active In-Patients Telemetry Roster' : 'Discharged Patient Archive (OUT)'}</span>
              <span className="text-xs font-medium text-slate-500">
                ({filteredPatients.length} {censusTab === 'IN' ? 'beds active' : 'records'})
              </span>
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
              {censusTab === 'IN'
                ? 'Local Edge AI continuous monitoring with instant non-diagnostic risk scoring'
                : 'Historical record of patients discharged from BlueEdge Glove monitoring'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Edge Sampling: 1.0s hop</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-mono uppercase text-[10px] tracking-wider ${
                isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="py-3.5 px-4">Patient / Ward</th>
                <th className="py-3.5 px-4">{censusTab === 'IN' ? 'Triage Status' : 'Discharge State'}</th>
                <th className="py-3.5 px-4">Heart Rate</th>
                <th className="py-3.5 px-4">SpO₂</th>
                <th className="py-3.5 px-4">Skin Temp</th>
                <th className="py-3.5 px-4">Respiration</th>
                <th className="py-3.5 px-4">Edge AI Risk</th>
                <th className="py-3.5 px-4">SQI Rating</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
              {filteredPatients.map((patient) => {
                const isSelected = selectedPatient.id === patient.id;
                const riskPercent = Math.round(patient.ai_analysis.risk_score * 100);

                const statusBadge =
                  patient.status === 'Critical'
                    ? isDark
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                    : patient.status === 'Warning'
                    ? isDark
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                    : isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-cyan-50/70 text-slate-900 font-semibold'
                        : isDark
                        ? 'hover:bg-slate-800/40 text-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {/* Patient / Ward */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{patient.id}</span>
                        <div>
                          <div className="font-bold">{patient.name}</div>
                          <div className="text-[11px] opacity-70 font-normal">
                            {patient.bed} • {patient.age}y {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {patient.is_discharged ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <LogOut className="w-3 h-3 text-slate-400" />
                          <span>OUT ({patient.discharged_at || 'Discharged'})</span>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            patient.status === 'Critical' ? 'bg-rose-500' : patient.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span>{patient.status}</span>
                        </span>
                      )}
                    </td>

                    {/* HR */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`font-bold ${patient.vitals.heart_rate > 115 ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                        {patient.vitals.heart_rate} BPM
                      </span>
                    </td>

                    {/* SpO2 */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`font-bold ${patient.vitals.spo2 < 92 ? 'text-rose-600 dark:text-rose-400' : patient.vitals.spo2 < 95 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                        {patient.vitals.spo2}%
                      </span>
                    </td>

                    {/* Temp */}
                    <td className="py-3.5 px-4 font-mono">
                      <span>{patient.vitals.temperature.toFixed(1)}°C</span>
                    </td>

                    {/* Resp */}
                    <td className="py-3.5 px-4 font-mono">
                      <span>{patient.vitals.respiratory_rate}/min</span>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              riskPercent > 70 ? 'bg-rose-500' : riskPercent > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${riskPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold">{riskPercent}%</span>
                      </div>
                    </td>

                    {/* SQI */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        patient.quality.overall_sqi >= 0.85
                          ? isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDark ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {(patient.quality.overall_sqi * 100).toFixed(0)}% ({patient.quality.ppg})
                      </span>
                    </td>

                    {/* Condition */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold">{patient.ai_analysis.predicted_state}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {(patient.ai_analysis.confidence * 100).toFixed(0)}% conf
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!patient.is_discharged && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDischargeModal(patient);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              isDark
                                ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/60'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Discharge Patient (Patient OUT)"
                          >
                            OUT
                          </button>
                        )}
                        <button
                          onClick={() => onSelectPatient(patient)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1"
                        >
                          <span>Telemetry</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
