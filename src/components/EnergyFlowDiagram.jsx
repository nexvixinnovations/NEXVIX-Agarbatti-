import React from 'react';
import { useMachine } from '../context/MachineContext';
import { Sun, BatteryCharging, Zap, ArrowRight, Activity, ShieldCheck, Flame, Fan, Radio } from 'lucide-react';

export const EnergyFlowDiagram = () => {
  const { liveTelemetry } = useMachine();

  const isNetPositive = liveTelemetry.netBalanceW >= 0;
  const isHighCurrentAlert = liveTelemetry.batteryCurrent >= 5.5;

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Smart Hybrid Energy Flow</span>
          </h4>
          <p className="text-[11px] text-slate-400">Solar PV + 12V Lithium Phosphate Battery System</p>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 ${
          isNetPositive 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
        }`}>
          <span>{isNetPositive ? 'NET POSITIVE YIELD' : 'BATTERY DISCHARGING'}</span>
        </div>
      </div>

      {/* Dynamic 3-Node Architecture Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative items-center">
        
        {/* Node 1: Solar Panel */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1.5">
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Solar Array (PV)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
              MPPT TRACKING
            </span>
          </div>
          
          <div className="mt-2.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white font-mono">{liveTelemetry.solarP}</span>
            <span className="text-xs font-bold text-amber-400">Watts</span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <div>V_pv: <span className="text-slate-200">{liveTelemetry.solarV} V</span></div>
            <div>I_pv: <span className="text-slate-200">{liveTelemetry.solarI} A</span></div>
          </div>
        </div>

        {/* Node 2: 12V Battery Pack */}
        <div className={`p-3.5 rounded-xl border relative overflow-hidden ${
          liveTelemetry.batterySoc < 20 
            ? 'bg-red-950/40 border-red-500/40 text-red-300' 
            : 'bg-slate-950/70 border-slate-700/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1.5">
              <BatteryCharging className="w-4 h-4" />
              <span>12V LiFePO4 Storage</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-300">
              {liveTelemetry.batterySoc}% SOC
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white font-mono">{liveTelemetry.batteryVoltage}</span>
            <span className="text-xs font-bold text-slate-400">Volts DC</span>
          </div>

          {/* SOC Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                liveTelemetry.batterySoc < 20 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${liveTelemetry.batterySoc}%` }}
            ></div>
          </div>
        </div>

        {/* Node 3: Machine Load */}
        <div className={`p-3.5 rounded-xl border relative overflow-hidden ${
          isHighCurrentAlert 
            ? 'bg-red-950/50 border-red-500/80 glow-red' 
            : 'bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold flex items-center space-x-1.5 ${
              isHighCurrentAlert ? 'text-red-400' : 'text-slate-200'
            }`}>
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Machine Load</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isHighCurrentAlert ? 'bg-red-900 text-red-100 animate-pulse' : 'bg-slate-800 text-slate-300'
            }`}>
              {isHighCurrentAlert ? 'SPIKE DETECTED' : 'NORMAL LOAD'}
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline space-x-1">
            <span className={`text-2xl font-black font-mono ${isHighCurrentAlert ? 'text-red-400' : 'text-white'}`}>
              {liveTelemetry.batteryPower}
            </span>
            <span className="text-xs font-bold text-amber-400">Watts ({liveTelemetry.batteryCurrent} A)</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span>Heater: <b className="text-slate-200">{liveTelemetry.heater}</b></span>
            <span>Fan: <b className="text-slate-200">{liveTelemetry.fan}</b></span>
          </div>
        </div>

      </div>

      {/* Energy Balance Sub-Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <span>Net Grid Balance:</span>
          <span className={`font-bold ${isNetPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
            {liveTelemetry.netBalanceW > 0 ? `+${liveTelemetry.netBalanceW}` : liveTelemetry.netBalanceW} W
          </span>
        </div>
        <div>
          Estimated Battery Runtime: <span className="text-slate-200 font-bold">~6.3 Hours</span>
        </div>
        <div>
          Cycle Cumulative Energy: <span className="text-emerald-400 font-bold">~49.8 Wh</span>
        </div>
      </div>

    </div>
  );
};
