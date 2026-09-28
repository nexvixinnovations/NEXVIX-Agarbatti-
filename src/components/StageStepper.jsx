import React from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  Flame, 
  Droplets, 
  ScanLine, 
  PackageCheck, 
  CheckCircle, 
  Loader2, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { processStages } from '../data/mockData';

export const StageStepper = () => {
  const { activeStageIndex, setActiveStageIndex, cycleMinute, liveTelemetry, fragranceState, batchSummary } = useMachine();

  const stageIcons = [Flame, Droplets, ScanLine, PackageCheck];

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Automated 4-Stage Process Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400">
            Current Stage: <span className="text-emerald-400 font-semibold">{processStages[activeStageIndex]?.label}</span>
          </p>
        </div>

        {/* Status pill */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Cycle Active: {Math.floor(cycleMinute)}m / 60m</span>
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {processStages.map((stage, idx) => {
          const Icon = stageIcons[idx];
          const isCompleted = activeStageIndex > idx;
          const isCurrent = activeStageIndex === idx;
          const isUpcoming = activeStageIndex < idx;

          let badgeText = 'Standby';
          if (idx === 0) {
            badgeText = `${liveTelemetry.chamberTemp}°C (${Math.floor(cycleMinute)}m)`;
          } else if (idx === 1) {
            badgeText = `${fragranceState.batchSprayedMl} ml / 2.5 ml`;
          } else if (idx === 2) {
            badgeText = `${batchSummary.totalSticks} / 5 sticks`;
          } else if (idx === 3) {
            badgeText = '1 Pack (5 sticks)';
          }

          return (
            <div
              key={stage.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                isCurrent
                  ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-900 border-emerald-500/70 glow-green shadow-lg'
                  : isCompleted
                  ? 'bg-slate-950/70 border-emerald-900/50 text-slate-300 hover:border-emerald-700/60'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700'
              }`}
            >
              {/* Active top line glow */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 animate-pulse"></div>
              )}

              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${
                  isCurrent 
                    ? 'bg-emerald-500/20 text-amber-400' 
                    : isCompleted 
                    ? 'bg-emerald-950 text-emerald-400' 
                    : 'bg-slate-900 text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex items-center space-x-1">
                  {isCompleted && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      <span>Done</span>
                    </span>
                  )}
                  {isCurrent && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-400 uppercase bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>Active</span>
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-[10px] text-slate-500 uppercase bg-slate-900 px-1.5 py-0.5 rounded font-mono">
                      Queue
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`}>
                    {stage.code}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-300">
                    {badgeText}
                  </span>
                </div>
                <h4 className={`text-sm font-bold mt-0.5 ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                  {stage.label}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-snug">
                  {stage.desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
