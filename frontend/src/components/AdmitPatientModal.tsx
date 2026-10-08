import React, { useState } from 'react';
import { UserPlus, X, Radio, Activity, Shield, Stethoscope, CheckCircle2 } from 'lucide-react';
import { PathologyType } from '../types';

interface AdmitPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdmit: (patientData: {
    name: string;
    bed: string;
    age: number;
    gender: string;
    admissionReason: string;
    pathology: PathologyType;
    gloveId: string;
  }) => void;
  isDark: boolean;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({
  isOpen,
  onClose,
  onAdmit,
  isDark,
}) => {
  const [name, setName] = useState('');
  const [bed, setBed] = useState('ICU-Bed 04');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [admissionReason, setAdmissionReason] = useState('Acute Asthma Exacerbation');
  const [pathology, setPathology] = useState<PathologyType>('Normal');
  const [gloveId, setGloveId] = useState('BE-GLOVE-07');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdmit({
      name: name.trim(),
      bed,
      age,
      gender,
      admissionReason,
      pathology,
      gloveId,
    });
    setName('');
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
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Patient IN — Clinical Admission</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Admit new patient & pair with BlueEdge Glove hardware
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient Full Name */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kavya Patel, Vikram Singhania, Neha Kulkarni..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Bed & Hardware Glove ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Assigned Bed / Ward
              </label>
              <input
                type="text"
                required
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                placeholder="e.g. ICU-Bed 04"
                className={`w-full px-3 py-2 rounded-xl border font-mono font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Paired Glove Unit
              </label>
              <select
                value={gloveId}
                onChange={(e) => setGloveId(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border font-mono font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="BE-GLOVE-01">BE-GLOVE-01 (ESP32-S3)</option>
                <option value="BE-GLOVE-02">BE-GLOVE-02 (ESP32-S3)</option>
                <option value="BE-GLOVE-04">BE-GLOVE-04 (ESP32-S3)</option>
                <option value="BE-GLOVE-07">BE-GLOVE-07 (ESP32-S3)</option>
                <option value="BE-GLOVE-09">BE-GLOVE-09 (ESP32-S3)</option>
                <option value="BE-GLOVE-12">BE-GLOVE-12 (ESP32-S3)</option>
              </select>
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Age (Years)
              </label>
              <input
                type="number"
                min={1}
                max={110}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl border font-mono font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Gender
              </label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setGender('F')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold border transition-all ${
                    gender === 'F'
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Female (F)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('M')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold border transition-all ${
                    gender === 'M'
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Male (M)
                </button>
              </div>
            </div>
          </div>

          {/* Admission Reason */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Admission Diagnosis / Clinical Reason
            </label>
            <input
              type="text"
              required
              value={admissionReason}
              onChange={(e) => setAdmissionReason(e.target.value)}
              placeholder="e.g. Post-Op CABG, Acute Respiratory Distress, Trauma Observation"
              className={`w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Baseline Condition */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Initial Physiological State
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'Hypoxia', 'Arrhythmia', 'Sepsis/Fever', 'Shock'] as PathologyType[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPathology(p)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-all ${
                    pathology === p
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500 font-bold'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Admission (Patient IN)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
