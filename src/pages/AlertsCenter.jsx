import React from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Droplets, 
  BatteryWarning, 
  Flame, 
  Wrench, 
  Activity, 
  Trash2, 
  Sparkles 
} from 'lucide-react';

export const AlertsCenter = () => {
  const { 
    alerts, 
    activeAlertCount, 
    acknowledgeAlert, 
    clearAllAlerts, 
    triggerDemoAlert,
    liveTelemetry,
    thresholds 
  } = useMachine();

  const getAlertIcon = (category, severity) => {
    if (category === 'POWER_SYSTEM') return <Zap className="w-5 h-5 text-yellow-400" />;
    if (category === 'FRAGRANCE_SYSTEM') return <Droplets className="w-5 h-5 text-purple-400" />;
    if (category === 'CHAMBER_TEMP') return <Flame className="w-5 h-5 text-orange-400" />;
    if (severity === 'critical') return <ShieldAlert className="w-5 h-5 text-red-400" />;
    return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Stats & Actions */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border ${
            activeAlertCount > 0 
              ? 'bg-red-950/80 border-red-500/50 text-red-400 glow-red animate-pulse' 
              : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
          }`}>
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Alerts & System Health Diagnostics</h2>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                activeAlertCount > 0 
                  ? 'bg-red-950 text-red-300 border-red-500/50' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              }`}>
                {activeAlertCount} Active Faults
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hardware watchdog for current surges, thermal excursions, tank levels, and battery integrity
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {activeAlertCount > 0 && (
            <button
              onClick={clearAllAlerts}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-700"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acknowledge All</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Real-Time Alert Rule Trigger Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Uneven Current Watchdog */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Uneven Current Rule</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              liveTelemetry.batteryCurrent >= thresholds.currentMaxSafeAmps 
                ? 'bg-red-950 text-red-400 border border-red-500/50 animate-pulse' 
                : 'bg-emerald-950 text-emerald-400'
            }`}>
              {liveTelemetry.batteryCurrent >= thresholds.currentMaxSafeAmps ? 'TRIGGERED' : 'NORMAL'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Fluctuation &gt; ±{thresholds.currentFluctuationPercent}% or &gt; {thresholds.currentMaxSafeAmps}A (Triggered by 6.9A at min 40).
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
            <span className="text-slate-500">Live: {liveTelemetry.batteryCurrent} A</span>
            <button
              onClick={() => triggerDemoAlert('CURRENT')}
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Test Surge
            </button>
          </div>
        </div>

        {/* Temperature Band Watchdog */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Thermal Band Rule</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              liveTelemetry.chamberTemp < thresholds.tempMinC || liveTelemetry.chamberTemp > thresholds.tempMaxC 
                ? 'bg-amber-950 text-amber-400 border border-amber-500/50' 
                : 'bg-emerald-950 text-emerald-400'
            }`}>
              {liveTelemetry.chamberTemp >= thresholds.tempMinC && liveTelemetry.chamberTemp <= thresholds.tempMaxC ? 'IN RANGE' : 'OUT OF BAND'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Target drying window: {thresholds.tempMinC} °C to {thresholds.tempMaxC} °C infrared convection.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
            <span className="text-slate-500">Live: {liveTelemetry.chamberTemp} °C</span>
            <button
              onClick={() => triggerDemoAlert('TEMP_HIGH')}
              className="text-orange-400 hover:text-orange-300 font-bold"
            >
              Test High Temp
            </button>
          </div>
        </div>

        {/* Fragrance & Battery Watchdogs */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <BatteryWarning className="w-3.5 h-3.5 text-emerald-400" />
              <span>Storage & Aroma Level</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
              MONITORED
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Low Fragrance (&lt;{thresholds.fragranceMinPercent}%) and Low Battery (&lt;{thresholds.batteryMinPercent}% SOC) warnings.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
            <button
              onClick={() => triggerDemoAlert('FRAGRANCE')}
              className="text-purple-400 hover:text-purple-300 font-bold"
            >
              Test Aroma Low
            </button>
            <button
              onClick={() => triggerDemoAlert('BATTERY')}
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Test Low Batt
            </button>
          </div>
        </div>

      </div>

      {/* 3. Real-Time Alert Event Stream Feed */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Hardware Event Stream & Telemetry Diagnostics Log
        </h3>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isActive = alert.active && !alert.acknowledged;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isActive && isCritical
                    ? 'bg-red-950/40 border-red-500/80 glow-red'
                    : isActive && isWarning
                    ? 'bg-amber-950/40 border-amber-500/80 glow-amber'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isCritical ? 'bg-red-950 text-red-400 border border-red-500/40' :
                    isWarning ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                    'bg-slate-900 text-blue-400'
                  }`}>
                    {getAlertIcon(alert.category, alert.severity)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
                        isCritical ? 'bg-red-900 text-red-100' :
                        isWarning ? 'bg-amber-900 text-amber-100' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {alert.faultCode}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">
                        {alert.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        • {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-2 flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                      <span>Phase: <b className="text-slate-200">{alert.stage}</b></span>
                      <span>Category: <b className="text-slate-200">{alert.category}</b></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  {isActive ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Acknowledged</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
