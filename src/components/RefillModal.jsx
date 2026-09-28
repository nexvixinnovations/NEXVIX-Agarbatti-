import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { Droplets, X, CheckCircle } from 'lucide-react';

export const RefillModal = ({ isOpen, onClose }) => {
  const { fragranceState, logRefill } = useMachine();
  
  const [addedMl, setAddedMl] = useState('500');
  const [technician, setTechnician] = useState('Lakshmi Devi (SHG Lead)');
  const [note, setNote] = useState('Mysore Sandalwood & Rose Pure Extract Batch 14');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const current = fragranceState.currentLevelMl;
  const capacity = fragranceState.tankCapacityMl;
  const maxAddable = Math.max(0, capacity - current);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseFloat(addedMl);
    if (isNaN(qty) || qty <= 0) return;
    
    logRefill(qty, technician, note);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/30">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Log Fragrance Tank Refill</h3>
            <p className="text-xs text-slate-400">1000 ml Stainless Aroma Reservoir</p>
          </div>
        </div>

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-sm flex items-center space-x-2 my-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Fragrance Refill logged! Tank level updated.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Refill Quantity (ml)</span>
                <span className="text-purple-400 font-mono">Current: {current} ml / {capacity} ml</span>
              </div>
              <input
                type="number"
                min="1"
                max={maxAddable || 1000}
                required
                value={addedMl}
                onChange={(e) => setAddedMl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operator / Technician Name
              </label>
              <input
                type="text"
                required
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Aroma Blend / Batch Notes
              </label>
              <textarea
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

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
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg"
              >
                Record Refill
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
