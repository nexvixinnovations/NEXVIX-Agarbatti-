import React from 'react';

export const CircularGauge = ({ 
  value, 
  min = 0, 
  max = 100, 
  targetMin = 60, 
  targetMax = 70, 
  unit = '°C', 
  title, 
  subtitle, 
  icon: Icon,
  type = 'temp', // 'temp' | 'humidity' | 'battery' | 'current'
  status = 'Normal'
}) => {
  // Normalize value percentage (0 to 1)
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  // Circumference for radius 42
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  // Semi-circle arc of 260 degrees (0.722 of full circle)
  const arcLength = circumference * 0.72;
  const strokeDashoffset = arcLength - (normalized * arcLength);

  // Determine status color
  let strokeColor = '#10B981'; // Green
  let glowClass = 'glow-green';
  let badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-500/40';

  if (type === 'temp') {
    if (value >= targetMin && value <= targetMax) {
      strokeColor = '#10B981'; // Optimal Green
    } else if (value < targetMin) {
      strokeColor = '#3B82F6'; // Blue / Warming up
      badgeColor = 'bg-blue-950 text-blue-400 border-blue-500/40';
    } else {
      strokeColor = '#EF4444'; // Red / Over-temperature
      glowClass = 'glow-red';
      badgeColor = 'bg-red-950 text-red-400 border-red-500/40';
    }
  } else if (type === 'battery') {
    if (value >= 50) strokeColor = '#10B981';
    else if (value >= 20) strokeColor = '#F59E0B';
    else {
      strokeColor = '#EF4444';
      glowClass = 'glow-red';
      badgeColor = 'bg-red-950 text-red-400 border-red-500/40';
    }
  } else if (type === 'current') {
    if (value >= 5.5) {
      strokeColor = '#EF4444';
      glowClass = 'glow-red';
      badgeColor = 'bg-red-950 text-red-400 border-red-500/40 animate-pulse';
    } else {
      strokeColor = '#F59E0B';
    }
  }

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-md transition-all hover:border-slate-700`}>
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-slate-800 text-amber-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</h4>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {status}
        </span>
      </div>

      {/* Radial Meter Visual */}
      <div className="flex flex-col items-center justify-center my-2 relative">
        <svg className="w-36 h-36 transform -rotate-135" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={arcLength}
            strokeDashoffset="0"
            className="text-slate-800"
            strokeLinecap="round"
          />
          
          {/* Optimal Target Range Overlay (for Chamber Temp: 60-70°C) */}
          {type === 'temp' && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#10B981"
              strokeOpacity="0.25"
              strokeWidth="10"
              strokeDasharray={arcLength}
              strokeDashoffset={arcLength * (1 - ((70 - min) / (max - min)))}
              strokeLinecap="round"
            />
          )}

          {/* Active Value Arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Big Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <div className="flex items-baseline space-x-0.5">
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">
              {value}
            </span>
            <span className="text-xs font-bold text-slate-400">{unit}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Footer Info / Target Range */}
      <div className="mt-1 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Min: {min}{unit}</span>
        {type === 'temp' && (
          <span className="text-emerald-400 font-semibold font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
            Target: 60-70°C
          </span>
        )}
        <span>Max: {max}{unit}</span>
      </div>
    </div>
  );
};
