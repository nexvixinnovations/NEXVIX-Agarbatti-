import React from 'react';
import { Sun, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-bold text-slate-200">NEXVIX IoT Platform</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono text-[11px]">v2.4.1 Production</span>
        </div>

        <p className="text-slate-300 font-medium max-w-xl text-center">
          "NEXVIX - Empowering rural women artisans through solar-powered smart manufacturing."
        </p>

        <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ISO 9001 Batch Calibrated</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
