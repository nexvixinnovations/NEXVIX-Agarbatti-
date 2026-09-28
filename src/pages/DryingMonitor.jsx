import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { 
  Flame, 
  Droplets, 
  Scale, 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  BatteryCharging, 
  Wind, 
  Activity,
  Layers,
  Thermometer
} from 'lucide-react';
import { dryingCycleLog, batteryPowerLog } from '../data/mockData';

export const DryingMonitor = () => {
  const { 
    cycleMinute, 
    setCycleMinute, 
    isPlaying, 
    setIsPlaying, 
    liveTelemetry,
    resetToBaseline 
  } = useMachine();

  const [activeMetric, setActiveMetric] = useState('all'); // 'all' | 'tempHum' | 'trayWeight' | 'current'

  // Combine drying log and battery power log into a unified chart dataset
  const unifiedChartData = dryingCycleLog.map((log, idx) => {
    const battLog = batteryPowerLog[idx] || {};
    return {
      minute: log.minute,
      timeLabel: `${log.minute}m`,
      temp: log.temp,
      humidity: log.humidity,
      trayWeight: log.trayWeight,
      current: battLog.current || 0,
      voltage: battLog.voltage || 12,
      power: battLog.power || 0,
      heater: log.heater,
      fan: log.fan,
      isSpike: battLog.isAlert || false
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header & Live Cycle Progress Strip */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-orange-950/80 text-orange-400 border border-orange-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Smart Drying Chamber Monitor</h2>
              <p className="text-xs text-slate-400">Target Drying Zone: 60 - 70 °C • Infrared Convection Cycle</p>
            </div>
          </div>
        </div>

        {/* Batch Timer & Controls */}
        <div className="flex items-center space-x-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="px-3 py-1">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Batch Timer</span>
            <span className="text-lg font-black font-mono text-amber-400">
              {String(Math.floor(cycleMinute)).padStart(2, '0')}:{String(Math.floor((cycleMinute % 1) * 60)).padStart(2, '0')}
              <span className="text-xs text-slate-500 font-normal"> / 60:00</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center transition ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={resetToBaseline}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Actuator & Source Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Heater Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Infrared Heater</span>
            <div className={`p-1.5 rounded-lg ${
              liveTelemetry.heater === 'ON' ? 'bg-orange-500/20 text-orange-400' :
              liveTelemetry.heater === 'Pulsing' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
              'bg-slate-800 text-slate-500'
            }`}>
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-xl font-black font-sans ${
              liveTelemetry.heater === 'ON' ? 'text-orange-400' :
              liveTelemetry.heater === 'Pulsing' ? 'text-amber-400' :
              'text-slate-400'
            }`}>
              {liveTelemetry.heater}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {liveTelemetry.heater === 'ON' ? '100% Duty' : liveTelemetry.heater === 'Pulsing' ? 'PID Modulated' : '0% (Cooling)'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>Chamber: {liveTelemetry.chamberTemp}°C</span>
            <span className="text-emerald-400">Target 60-70°C</span>
          </div>
        </div>

        {/* Fan Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exhaust Fan</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wind className={`w-4 h-4 ${liveTelemetry.fan === 'High' ? 'animate-spin-fast' : liveTelemetry.fan === 'Medium' ? 'animate-spin-slow' : ''}`} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-black font-sans text-cyan-300">
              {liveTelemetry.fan}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {liveTelemetry.fan === 'High' ? '3,400 RPM' : liveTelemetry.fan === 'Medium' ? '2,200 RPM' : '1,200 RPM'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>Humidity: {liveTelemetry.humidity}%</span>
            <span className="text-cyan-400">Moisture Extract</span>
          </div>
        </div>

        {/* Tray Weight Real-time */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tray Load Cell</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-black font-mono text-white">
              {liveTelemetry.trayWeight}
            </span>
            <span className="text-xs font-bold text-slate-400">grams</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>Loss: -{liveTelemetry.stickLossG}g</span>
            <span className="text-amber-400 font-bold">-{liveTelemetry.stickLossPct}%</span>
          </div>
        </div>

        {/* Power Source Indicator */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Power Source</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sun className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-lg font-black font-sans text-amber-300 truncate">
              Solar + Battery
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>Solar: {liveTelemetry.solarP}W</span>
            <span className="text-emerald-400">Draw: {liveTelemetry.batteryPower}W</span>
          </div>
        </div>

      </div>

      {/* 3. Interactive Multi-Metric Drying Charts */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        
        {/* Chart Header & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>60-Minute Drying Telemetry Analysis</span>
            </h3>
            <p className="text-xs text-slate-400">
              Temperature (°C), Humidity (%), Tray Weight (g), and Current Draw (A) vs Cycle Time
            </p>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMetric('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeMetric === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Series
            </button>
            <button
              onClick={() => setActiveMetric('tempHum')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeMetric === 'tempHum' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Temp & Humidity
            </button>
            <button
              onClick={() => setActiveMetric('trayWeight')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeMetric === 'trayWeight' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tray Weight (g)
            </button>
            <button
              onClick={() => setActiveMetric('current')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeMetric === 'current' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Current Draw (A)
            </button>
          </div>
        </div>

        {/* Recharts Live Chart Container */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={unifiedChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="currGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
              
              <XAxis 
                dataKey="timeLabel" 
                stroke="#94A3B8" 
                tick={{ fill: '#94A3B8', fontSize: 11 }} 
              />
              
              <YAxis 
                stroke="#94A3B8" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                domain={[0, 'auto']}
              />

              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }} 
              />
              
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
              />

              {/* Highlight Target Temperature Band (60-70 °C) */}
              {(activeMetric === 'all' || activeMetric === 'tempHum') && (
                <ReferenceArea y1={60} y2={70} fill="#10B981" fillOpacity={0.1} stroke="#10B981" strokeDasharray="3 3" />
              )}

              {/* Minute 40 Uneven Current Spike Annotation Line */}
              <ReferenceLine x="40m" stroke="#EF4444" strokeDasharray="4 4" label={{ value: '6.9A Surge Alert (Min 40)', fill: '#EF4444', fontSize: 11, position: 'insideTopLeft' }} />

              {/* Current Playhead Vertical Line */}
              <ReferenceLine x={`${Math.round(cycleMinute)}m`} stroke="#F59E0B" strokeWidth={2} label={{ value: 'Live Now', fill: '#F59E0B', fontSize: 10, position: 'top' }} />

              {/* Series according to active filter */}
              {(activeMetric === 'all' || activeMetric === 'tempHum') && (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="temp" 
                    name="Temperature (°C)" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#tempGradient)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    name="Humidity (%)" 
                    stroke="#06B6D4" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#06B6D4' }} 
                  />
                </>
              )}

              {(activeMetric === 'all' || activeMetric === 'trayWeight') && (
                <Area 
                  type="monotone" 
                  dataKey="trayWeight" 
                  name="Tray Weight (g)" 
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#weightGradient)" 
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'current') && (
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  name="Current Draw (A)" 
                  stroke="#EF4444" 
                  strokeWidth={2.5} 
                  dot={{ r: 5, fill: '#EF4444' }} 
                />
              )}

            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Complete Drying Cycle Tabular Log (0 to 60 Minutes) */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Detailed 60-Minute Drying Stage Log Table
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Minute</th>
                  <th className="py-2.5 px-3">Temp (°C)</th>
                  <th className="py-2.5 px-3">Humidity (%)</th>
                  <th className="py-2.5 px-3">Heater</th>
                  <th className="py-2.5 px-3">Fan Speed</th>
                  <th className="py-2.5 px-3">Tray Weight (g)</th>
                  <th className="py-2.5 px-3">Current Draw (A)</th>
                  <th className="py-2.5 px-3">Phase Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {dryingCycleLog.map((row, idx) => {
                  const bRow = batteryPowerLog[idx] || {};
                  const isCurActive = Math.abs(cycleMinute - row.minute) <= 5;
                  const isSpike = bRow.isAlert;

                  return (
                    <tr 
                      key={row.minute} 
                      className={`transition ${
                        isCurActive ? 'bg-emerald-950/40 text-emerald-200 font-bold' :
                        isSpike ? 'bg-red-950/30 text-red-200' : 'hover:bg-slate-950/40'
                      }`}
                    >
                      <td className="py-2 px-3 font-bold text-amber-400">{row.minute} min</td>
                      <td className="py-2 px-3 font-semibold">{row.temp} °C</td>
                      <td className="py-2 px-3">{row.humidity} %</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.heater === 'ON' ? 'bg-orange-950 text-orange-400 border border-orange-500/30' :
                          row.heater === 'Pulsing' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {row.heater}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-cyan-400">{row.fan}</span>
                      </td>
                      <td className="py-2 px-3 font-bold text-white">{row.trayWeight} g</td>
                      <td className={`py-2 px-3 ${isSpike ? 'text-red-400 font-black animate-pulse' : 'text-slate-300'}`}>
                        {bRow.current} A
                      </td>
                      <td className="py-2 px-3">
                        {isSpike ? (
                          <span className="text-red-400 font-bold text-[10px] uppercase bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50">
                            UNEVEN CURRENT ALERT
                          </span>
                        ) : row.minute === 60 ? (
                          <span className="text-emerald-400 font-bold text-[10px]">Properly Dried (23.1%)</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Normal Evaporation</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
