import React from 'react';
import { useMachine } from '../context/MachineContext';
import { Droplets, AlertTriangle, Plus, Sparkles, Wind, Gauge } from 'lucide-react';

export const FragranceTankGraphic = ({ onOpenRefillModal }) => {
  const { fragranceState, thresholds } = useMachine();

  const {
    tankCapacityMl,
    currentLevelMl,
    levelPercent,
    mlPerStick,
    batchSprayedMl,
    fragranceType,
    pumpPressureBar
  } = fragranceState;

  const isLow = levelPercent < thresholds.fragranceMinPercent;

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-500/30">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Fragrance Tank (1 L)</h4>
            <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{fragranceType}</p>
          </div>
        </div>

        <button
          onClick={onOpenRefillModal}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Refill</span>
        </button>
      </div>

      {/* Main Tank Visual Graphic */}
      <div className="grid grid-cols-12 gap-4 items-center py-2">
        {/* SVG Liquid Cylinder */}
        <div className="col-span-5 flex justify-center">
          <div className="relative w-24 h-40 bg-slate-950/90 rounded-2xl border-2 border-slate-700/80 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
            
            {/* Measurement Graduations */}
            <div className="absolute inset-y-2 right-1.5 flex flex-col justify-between text-[8px] font-mono text-slate-500 pointer-events-none z-10">
              <span>1000ml</span>
              <span>750ml</span>
              <span>500ml</span>
              <span>250ml</span>
              <span className="text-red-400 font-bold">150ml (15%)</span>
            </div>

            {/* Low Threshold Dashed Line at 15% */}
            <div className="absolute bottom-[15%] left-0 right-0 border-b border-dashed border-red-500/70 z-10"></div>

            {/* Liquid Fill */}
            <div 
              className={`w-full rounded-xl transition-all duration-1000 relative ${
                isLow 
                  ? 'bg-gradient-to-t from-red-600 to-rose-400 animate-pulse glow-red' 
                  : 'bg-gradient-to-t from-purple-800 via-fuchsia-600 to-purple-400 glow-purple'
              }`}
              style={{ height: `${Math.max(8, levelPercent)}%` }}
            >
              {/* Liquid Wave Ripple on top */}
              <div className="absolute -top-2 left-0 right-0 h-3 bg-fuchsia-300/30 rounded-full blur-[1px] animate-pulse"></div>
            </div>

            {/* Glass Glare */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/30 pointer-events-none rounded-2xl"></div>
          </div>
        </div>

        {/* Level Stats & Dosing Details */}
        <div className="col-span-7 space-y-2.5">
          {/* Big Level Display */}
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                {currentLevelMl}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 1000 ml</span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                isLow ? 'bg-red-950 text-red-300 border border-red-500' : 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
              }`}>
                {levelPercent}% Remaining
              </span>
              {isLow && (
                <span className="text-[10px] text-red-400 flex items-center space-x-1 animate-bounce">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Refill Req</span>
                </span>
              )}
            </div>
          </div>

          {/* Dosing Stats */}
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Spray Rate:</span>
              <span className="text-slate-200 font-semibold">{mlPerStick} ml / stick</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Batch Dosed (5s):</span>
              <span className="text-purple-400 font-semibold">{batchSprayedMl} ml</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Pump Pressure:</span>
              <span className="text-emerald-400 font-semibold">{pumpPressureBar} Bar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atomizer Sub-Status */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1 text-emerald-400">
          <Wind className="w-3.5 h-3.5" />
          <span>Micro-Mist Atomizer: READY</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">~1,995 sticks reserve</span>
      </div>

    </div>
  );
};
