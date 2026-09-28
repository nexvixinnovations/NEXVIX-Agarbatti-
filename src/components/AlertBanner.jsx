import React from 'react';
import { useMachine } from '../context/MachineContext';
import { AlertTriangle, Zap, CheckCircle2, Bell, X, ShieldAlert, ArrowRight } from 'lucide-react';

export const AlertBanner = () => {
  const { activeAlert, acknowledgeAlert, setActiveTab } = useMachine();

  if (!activeAlert) return null;

  const isCritical = activeAlert.severity === 'critical';

  return (
    <div className={`w-full py-2.5 px-4 sm:px-6 transition-all duration-300 border-b flex items-center justify-between shadow-lg relative z-40 ${
      isCritical 
        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-500/50 glow-red' 
        : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 border-amber-400 font-medium glow-amber'
    }`}>
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 rounded-full ${isCritical ? 'bg-white/20 animate-pulse' : 'bg-black/10'}`}>
            {isCritical ? <Zap className="w-5 h-5 text-yellow-300 animate-bounce" /> : <AlertTriangle className="w-5 h-5 text-slate-950" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${
                isCritical ? 'bg-red-900/60 text-red-100' : 'bg-black/20 text-slate-950'
              }`}>
                {activeAlert.faultCode || 'HARDWARE ALERT'}
              </span>
              <span className="font-bold text-sm sm:text-base">
                {activeAlert.title}
              </span>
            </div>
            <p className={`text-xs hidden sm:block ${isCritical ? 'text-red-100/90' : 'text-slate-900/90'}`}>
              {activeAlert.message}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-auto sm:ml-0">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center space-x-1 transition shadow-sm ${
              isCritical 
                ? 'bg-white text-red-700 hover:bg-red-50' 
                : 'bg-slate-950 text-amber-400 hover:bg-slate-900'
            }`}
          >
            <span>View Diagnostics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => acknowledgeAlert(activeAlert.id)}
            title="Acknowledge Alert"
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition flex items-center space-x-1 ${
              isCritical 
                ? 'border-white/40 hover:bg-white/20 text-white' 
                : 'border-slate-950/40 hover:bg-black/10 text-slate-950'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Acknowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AlertToast = () => {
  const { activeToast, setActiveToast, acknowledgeAlert, setActiveTab } = useMachine();

  if (!activeToast) return null;

  const isCritical = activeToast.severity === 'critical';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-slide-in-right px-4">
      <div className={`p-4 rounded-xl shadow-2xl border flex items-start space-x-3 backdrop-blur-md ${
        isCritical 
          ? 'bg-slate-900/95 border-red-500/80 text-white glow-red ring-1 ring-red-500' 
          : 'bg-slate-900/95 border-amber-500/80 text-white glow-amber ring-1 ring-amber-500'
      }`}>
        <div className={`p-2 rounded-lg shrink-0 ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-100 truncate flex items-center space-x-1.5">
              <span>{activeToast.title}</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">{activeToast.timestamp}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {activeToast.message}
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => {
                setActiveTab('alerts');
                setActiveToast(null);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                acknowledgeAlert(activeToast.id);
                setActiveToast(null);
              }}
              className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Acknowledge
            </button>
          </div>
        </div>
        <button 
          onClick={() => setActiveToast(null)}
          className="text-slate-400 hover:text-slate-200 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
