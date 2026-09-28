import React from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  BatteryCharging, 
  Zap, 
  Sun, 
  Clock, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  Cpu, 
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { batteryPowerLog } from '../data/mockData';

export const PowerBattery = () => {
  const { liveTelemetry, cycleMinute, triggerDemoAlert } = useMachine();

  const isCurrentSurge = liveTelemetry.batteryCurrent >= 5.5;

  const chartData = batteryPowerLog.map((log) => ({
    minute: `${log.minute}m`,
    current: log.current,
    voltage: log.voltage,
    power: log.power,
    solarPower: log.solarPower,
    netPower: Number((log.solarPower - log.power).toFixed(1)),
    batterySoc: log.batterySoc,
    isAlert: log.isAlert
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Live Key Metrics */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Power & 12V Battery Analytics</h2>
            <p className="text-xs text-slate-400">
              Real-time Current Absorption • Solar PV Generation vs Machine Consumption • 50 Wh Total Cycle Energy
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => triggerDemoAlert('CURRENT')}
            className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
            <span>Simulate 6.9A Surge Spike</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Power Draw */}
        <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all ${
          isCurrentSurge 
            ? 'bg-red-950/50 border-red-500/80 glow-red' 
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Machine Draw</span>
            <div className={`p-1.5 rounded-lg ${isCurrentSurge ? 'bg-red-500/20 text-red-400 animate-ping' : 'bg-slate-800 text-amber-400'}`}>
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className={`text-2xl font-black font-mono ${isCurrentSurge ? 'text-red-400' : 'text-white'}`}>
              {liveTelemetry.batteryPower}
            </span>
            <span className="text-xs font-bold text-amber-400">Watts ({liveTelemetry.batteryCurrent} A)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>Voltage: {liveTelemetry.batteryVoltage} V</span>
            <span className={isCurrentSurge ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {isCurrentSurge ? '6.9A ALERT' : 'Normal Current'}
            </span>
          </div>
        </div>

        {/* Solar Panel Input */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Solar Array Input</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sun className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className="text-2xl font-black font-mono text-white">
              {liveTelemetry.solarP}
            </span>
            <span className="text-xs font-bold text-amber-400">Watts</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>PV: {liveTelemetry.solarV}V @ {liveTelemetry.solarI}A</span>
            <span className="text-emerald-400 font-semibold">Clean Energy</span>
          </div>
        </div>

        {/* Battery State of Charge & Health */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Battery SOC (12V Pack)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className="text-2xl font-black font-mono text-white">
              {liveTelemetry.batterySoc}
            </span>
            <span className="text-xs font-bold text-slate-400">% SOC ({liveTelemetry.batteryVoltage} V)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>LiFePO4 4S Pack</span>
            <span className="text-emerald-400">Health: 99.4%</span>
          </div>
        </div>

        {/* Estimated Runtime & Energy */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cycle Energy & Runtime</span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className="text-2xl font-black font-mono text-emerald-400">
              ~50
            </span>
            <span className="text-xs font-bold text-slate-400">Wh / Cycle</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between font-mono">
            <span>Est. Autonomy:</span>
            <span className="text-slate-200 font-bold">~6.3 Hours</span>
          </div>
        </div>

      </div>

      {/* 3. Recharts: Current Absorption & Generation vs Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Chart 1: Current Draw (Amperes) Over 60 Minutes (Highlighting 6.9A Surge) */}
        <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Current Absorbed by Machine (Amperes)
              </h3>
              <p className="text-[11px] text-slate-400">Highlighting minute 40 current fluctuation spike (6.9 A)</p>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis dataKey="minute" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[0, 8]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px' }} />
                
                {/* Safe limit reference line (5.5A) */}
                <ReferenceLine y={5.5} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Safe Limit 5.5A', fill: '#EF4444', fontSize: 10 }} />
                
                <Bar dataKey="current" name="Current Draw (A)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="current" name="Current Curve" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 5, fill: '#EF4444' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Solar Generation (W) vs Machine Power Consumption (W) */}
        <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Solar Generation vs Machine Consumption
              </h3>
              <p className="text-[11px] text-slate-400">Real-time Solar PV Watts vs Absorbed Load Watts</p>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis dataKey="minute" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="solarPower" name="Solar PV Generation (W)" stroke="#10B981" fill="url(#solarGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="power" name="Machine Load (W)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: '#F59E0B' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Complete 12V Battery Power Log Table */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          12 V Battery System Telemetry Log
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Minute</th>
                <th className="py-2.5 px-3">Current (A)</th>
                <th className="py-2.5 px-3">Voltage (V)</th>
                <th className="py-2.5 px-3">Power (W)</th>
                <th className="py-2.5 px-3">Solar Gen (W)</th>
                <th className="py-2.5 px-3">Battery SOC</th>
                <th className="py-2.5 px-3">Status Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {batteryPowerLog.map((row) => {
                const isSurge = row.isAlert;
                return (
                  <tr 
                    key={row.minute} 
                    className={`transition ${isSurge ? 'bg-red-950/40 text-red-200 font-bold' : 'hover:bg-slate-950/40'}`}
                  >
                    <td className="py-2.5 px-3 font-bold text-amber-400">{row.minute} min</td>
                    <td className={`py-2.5 px-3 font-bold ${isSurge ? 'text-red-400 text-sm' : 'text-slate-200'}`}>
                      {row.current} A
                    </td>
                    <td className="py-2.5 px-3">{row.voltage} V</td>
                    <td className="py-2.5 px-3 font-semibold">{row.power} W</td>
                    <td className="py-2.5 px-3 text-emerald-400">{row.solarPower} W</td>
                    <td className="py-2.5 px-3">{row.batterySoc}%</td>
                    <td className="py-2.5 px-3">
                      {isSurge ? (
                        <span className="text-red-400 font-extrabold uppercase bg-red-950/80 px-2 py-0.5 rounded border border-red-500/60 animate-pulse">
                          {row.status}
                        </span>
                      ) : (
                        <span className="text-slate-400">{row.status}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>* Total drying cycle energy consumption is calibrated at approximately 50 Wh.</span>
          <span className="text-emerald-400 font-bold">100% Solar Self-Sufficient with 12V LiFePO4 Buffer</span>
        </div>
      </div>

    </div>
  );
};
