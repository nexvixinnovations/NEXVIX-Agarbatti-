import React from 'react';
import { useMachine } from '../context/MachineContext';
import { FragranceTankGraphic } from '../components/FragranceTankGraphic';
import { 
  Droplets, 
  Plus, 
  Wind, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  History, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export const FragranceModule = ({ onOpenRefillModal }) => {
  const { fragranceState, triggerDemoAlert, thresholds } = useMachine();

  const isLow = fragranceState.levelPercent < thresholds.fragranceMinPercent;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Actions */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/30">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Fragrance Micro-Mist Dosing Module</h2>
            <p className="text-xs text-slate-400">
              1000 ml Stainless Aroma Tank • 0.5 ml / stick Precision Ultrasonic Atomizer
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => triggerDemoAlert('FRAGRANCE')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulate Low Fragrance (&lt;15%)</span>
          </button>
          <button
            onClick={onOpenRefillModal}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Log Tank Refill</span>
          </button>
        </div>
      </div>

      {/* 2. Top Grid: Tank Graphic & Dosing Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6">
          <FragranceTankGraphic onOpenRefillModal={onOpenRefillModal} />
        </div>

        <div className="lg:col-span-6 space-y-4">
          
          {/* Dosing Specs Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Dosing Calibration & Parameters</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Dose Per Stick</span>
                <span className="text-lg font-black text-white block mt-0.5">{fragranceState.mlPerStick} ml</span>
                <span className="text-[9px] text-emerald-400">Micro-precision spray</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Batch Total (5 Sticks)</span>
                <span className="text-lg font-black text-purple-400 block mt-0.5">{fragranceState.batchSprayedMl} ml</span>
                <span className="text-[9px] text-slate-400">5 x 0.50 ml</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Nozzle Pressure</span>
                <span className="text-lg font-black text-cyan-400 block mt-0.5">{fragranceState.pumpPressureBar} Bar</span>
                <span className="text-[9px] text-cyan-500">Dual Solenoid Pulse</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Remaining Capacity</span>
                <span className="text-lg font-black text-emerald-400 block mt-0.5">{fragranceState.currentLevelMl} ml</span>
                <span className="text-[9px] text-emerald-500">~1,995 Sticks reserve</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
              <span>Active Aroma Blend:</span>
              <span className="font-bold font-mono text-white">{fragranceState.fragranceType}</span>
            </div>
          </div>

          {/* Low Level Alert Card if triggered */}
          {isLow && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/80 glow-red text-red-200 text-xs flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="font-bold text-red-100 text-sm">Low Fragrance Warning (&lt; 15%)</h4>
                <p className="mt-1 text-red-300">
                  Fragrance tank level is at {fragranceState.currentLevelMl} ml ({fragranceState.levelPercent}%). Please top up reservoir to prevent pump cavitation.
                </p>
                <button
                  onClick={onOpenRefillModal}
                  className="mt-2.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition"
                >
                  Refill Now
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. Fragrance Refill History Log */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fragrance Refill & Maintenance Log</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {fragranceState.refillHistory.length} Refills Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Refill ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Added Volume</th>
                <th className="py-2.5 px-3">Operator / Artisan</th>
                <th className="py-2.5 px-3">Batch & Aroma Notes</th>
                <th className="py-2.5 px-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {fragranceState.refillHistory.map((refill) => (
                <tr key={refill.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-2.5 px-3 font-bold text-purple-400">{refill.id}</td>
                  <td className="py-2.5 px-3 text-slate-400">{refill.date}</td>
                  <td className="py-2.5 px-3 font-bold text-white">+{refill.addedMl} ml</td>
                  <td className="py-2.5 px-3 text-emerald-300 font-semibold">{refill.technician}</td>
                  <td className="py-2.5 px-3 text-slate-400">{refill.note}</td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
