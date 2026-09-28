import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { Scale, X, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

export const WeightEntryModal = ({ isOpen, onClose }) => {
  const { addStickWeightRecord, thresholds } = useMachine();
  
  const [beforeWeight, setBeforeWeight] = useState('1.86');
  const [afterWeight, setAfterWeight] = useState('1.43');
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const bW = parseFloat(beforeWeight) || 0;
  const aW = parseFloat(afterWeight) || 0;
  const lossG = bW > 0 && aW > 0 ? Number((bW - aW).toFixed(2)) : 0;
  const lossPct = bW > 0 && aW > 0 ? Number(((lossG / bW) * 100).toFixed(2)) : 0;

  let quality = 'Properly Dried';
  let badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
  if (lossPct < thresholds.weightLossMinPercent) {
    quality = 'Under-dried';
    badgeColor = 'bg-amber-950 text-amber-300 border-amber-500/40';
  } else if (lossPct > thresholds.weightLossMaxPercent) {
    quality = 'Over-dried';
    badgeColor = 'bg-red-950 text-red-300 border-red-500/40';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bW <= 0 || aW <= 0) return;
    const result = addStickWeightRecord(beforeWeight, afterWeight);
    if (result) {
      setSuccessMsg(`Stick ${result.id} recorded successfully with ${result.lossPercent}% loss (${result.status})`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Record Agarbatti Stick Weight</h3>
            <p className="text-xs text-slate-400">HX711 Precision Load-Cell Manual Calibration & Entry</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-sm flex items-center space-x-2 my-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Before Drying Weight (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={beforeWeight}
                  onChange={(e) => setBeforeWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 1.88"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  After Drying Weight (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={afterWeight}
                  onChange={(e) => setAfterWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 1.44"
                />
              </div>
            </div>

            {/* Instant Real-Time Calculation Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Calculated Metrics</span>
                <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${badgeColor}`}>
                  {quality}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="text-slate-400">
                  Moisture Loss: <span className="text-white font-bold">{lossG > 0 ? lossG : 0} g</span>
                </div>
                <div className="text-slate-400">
                  Loss Percentage: <span className="text-emerald-400 font-bold">{lossPct}%</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                Target loss standard: 20.0% to 25.0% for optimum aromatic infusion.
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg flex items-center space-x-1.5"
              >
                <span>Save & Calculate</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
