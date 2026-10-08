import React, { useState } from 'react';
import { LogOut, X, AlertTriangle, CheckCircle2, Shield, Heart, Activity } from 'lucide-react';
import { Patient } from '../types';

interface DischargePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirmDischarge: (patientId: string, disposition: string, notes: string) => void;
  isDark: boolean;
}

export const DischargePatientModal: React.FC<DischargePatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onConfirmDischarge,
  isDark,
}) => {
  const [disposition, setDisposition] = useState('Discharged Home (Recovery Complete)');
  const [notes, setNotes] = useState('Physiological parameters stable over 24h window; discharged with oral medications.');

  if (!isOpen || !patient) return null;

  const handleDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDischarge(patient.id, disposition, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl transition-all ${
        isDark
          ? 'bg-slate-900 border-slate-700 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Patient OUT — Clinical Discharge</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Discharge patient & unpair BlueEdge Glove hardware
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleDischarge} className="p-6 space-y-4 text-xs">
          {/* Patient Summary Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">{patient.id}</span>
                <span className="font-bold text-sm">{patient.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  patient.status === 'Critical' 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' 
                    : patient.status === 'Warning'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                }`}>
                  {patient.status}
                </span>
              </div>
              <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {patient.bed} • {patient.age}y {patient.gender} • {patient.admission_reason}
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">Current Vitals:</div>
              <div className="font-bold text-sm">
                HR: {patient.vitals.heart_rate} | SpO₂: {patient.vitals.spo2}%
              </div>
            </div>
          </div>

          {/* Discharge Disposition */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Discharge Disposition / Destination *
            </label>
            <select
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="Discharged Home (Recovery Complete)">Discharged Home (Recovery Complete)</option>
              <option value="Transferred to Step-Down Ward">Transferred to Step-Down Ward</option>
              <option value="Transferred to General Ward">Transferred to General Ward</option>
              <option value="Referred to Specialized Tertiary Center">Referred to Specialized Tertiary Center</option>
              <option value="Escalated to Emergency Surgery">Escalated to Emergency Surgery</option>
            </select>
          </div>

          {/* Discharge Clinical Notes */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Clinical Discharge Summary & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter physician observations and follow-up care instructions..."
              className={`w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none resize-none ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Glove Uncoupling Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Confirming discharge will mark <strong>{patient.name}</strong> as <strong>PATIENT OUT</strong>. The wearable BlueEdge Glove will be uncoupled, streaming archived, and the bed released for census.
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Confirm Discharge (Patient OUT)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
