import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Droplets, 
  BatteryWarning, 
  Sliders, 
  FastForward, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Flame
} from 'lucide-react';

export const DemoControlBar = () => {
  const {
    cycleMinute,
    setCycleMinute,
    playbackSpeed,
    setPlaybackSpeed,
    isPlaying,
    setIsPlaying,
    triggerDemoAlert,
    resetToBaseline,
    liveTelemetry,
  } = useMachine();

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-slate-900/90 dark:bg-slate-900/95 border-b border-emerald-900/40 backdrop-blur-md sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Title & Live Status Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono">DEMO CONTROLS</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-slate-300">
              <span className="text-slate-400">Cycle Time:</span>
              <span className="font-mono font-bold text-amber-400 text-sm bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                {String(Math.floor(cycleMinute)).padStart(2, '0')}:{String(Math.floor((cycleMinute % 1) * 60)).padStart(2, '0')} / 60:00 min
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Current:</span>
              <span className={`font-mono font-semibold ${liveTelemetry.batteryCurrent >= 5.5 ? 'text-red-400 animate-pulse font-bold' : 'text-emerald-400'}`}>
                {liveTelemetry.batteryCurrent} A
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Speeds */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
              {[1, 5, 10, 30].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                    playbackSpeed === spd 
                      ? 'bg-emerald-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Reset */}
            <button
              onClick={resetToBaseline}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1 border border-slate-700 transition"
              title="Reset to 0m Baseline Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset</span>
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title={isExpanded ? 'Collapse Demo Panel' : 'Expand Demo Panel'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Panel: Scrubber & Force Triggers */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            {/* Scrubber */}
            <div className="flex-1 flex items-center space-x-3 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
              <span className="text-[11px] font-medium text-slate-400 shrink-0">Time Scrubber:</span>
              <input
                type="range"
                min="0"
                max="60"
                step="0.5"
                value={cycleMinute}
                onChange={(e) => setCycleMinute(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
              />
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 min-w-[45px] text-right">
                {Math.round(cycleMinute)} min
              </span>
            </div>

            {/* Force Alert Buttons for Judges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1 hidden xl:inline">Simulate Faults:</span>
              
              <button
                onClick={() => triggerDemoAlert('CURRENT')}
                className="px-2.5 py-1 rounded-md bg-red-950/70 hover:bg-red-900/90 text-red-300 hover:text-white border border-red-700/50 flex items-center space-x-1 transition font-medium text-[11px]"
                title="Simulates the 6.9A current surge at minute 40"
              >
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>6.9A Surge (Min 40)</span>
              </button>

              <button
                onClick={() => triggerDemoAlert('FRAGRANCE')}
                className="px-2.5 py-1 rounded-md bg-purple-950/70 hover:bg-purple-900/90 text-purple-300 hover:text-white border border-purple-700/50 flex items-center space-x-1 transition font-medium text-[11px]"
                title="Simulates fragrance tank level dropping to 12%"
              >
                <Droplets className="w-3 h-3 text-purple-400" />
                <span>Low Fragrance (&lt;15%)</span>
              </button>

              <button
                onClick={() => triggerDemoAlert('BATTERY')}
                className="px-2.5 py-1 rounded-md bg-amber-950/70 hover:bg-amber-900/90 text-amber-300 hover:text-white border border-amber-700/50 flex items-center space-x-1 transition font-medium text-[11px]"
                title="Simulates low battery state of charge"
              >
                <BatteryWarning className="w-3 h-3 text-amber-400" />
                <span>Low Battery (&lt;20%)</span>
              </button>

              <button
                onClick={() => triggerDemoAlert('TEMP_HIGH')}
                className="px-2.5 py-1 rounded-md bg-orange-950/70 hover:bg-orange-900/90 text-orange-300 hover:text-white border border-orange-700/50 flex items-center space-x-1 transition font-medium text-[11px]"
                title="Simulates over-temperature excursion"
              >
                <Flame className="w-3 h-3 text-orange-400" />
                <span>High Temp (&gt;70°C)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
