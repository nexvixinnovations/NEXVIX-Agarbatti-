import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  SlidersHorizontal, 
  Cpu, 
  Globe, 
  Moon, 
  Sun, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Flame, 
  Droplets, 
  Scale, 
  Battery, 
  Wifi, 
  Layers 
} from 'lucide-react';
import { ESP32_CONFIG } from '../config/esp32Config';

export const SettingsPage = ({ onOpenHardwareModal }) => {
  const { 
    thresholds, 
    setThresholds, 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t, 
    hardwareConfig, 
    setHardwareConfig 
  } = useMachine();

  const [formThresholds, setFormThresholds] = useState(thresholds);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    setThresholds(formThresholds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Settings & Calibration</h2>
            <p className="text-xs text-slate-400">
              Configure telemetry alert thresholds, ESP32 IoT gateway protocols, and user interface preferences
            </p>
          </div>
        </div>

        <button
          onClick={onOpenHardwareModal}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition"
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Open Hardware Gateway</span>
        </button>
      </div>

      {/* 2. Editable Alert Thresholds Form */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Configurable Alert Thresholds & Safety Limits
            </h3>
            <p className="text-xs text-slate-400">
              Adjust safety triggers for current surges, chamber thermal bands, tank volume, and moisture loss tags.
            </p>
          </div>
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1 rounded-lg flex items-center space-x-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thresholds Saved!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            
            {/* Uneven Current Fluctuation */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Max Safe Current (Amps)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formThresholds.currentMaxSafeAmps}
                onChange={(e) => setFormThresholds({ ...formThresholds, currentMaxSafeAmps: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Surge trigger (Baseline 5.5A / Spike 6.9A)</span>
            </div>

            {/* Min Chamber Temp */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Chamber Temp Min (°C)</span>
              </label>
              <input
                type="number"
                step="1"
                value={formThresholds.tempMinC}
                onChange={(e) => setFormThresholds({ ...formThresholds, tempMinC: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 60 °C lower drying limit</span>
            </div>

            {/* Max Chamber Temp */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Chamber Temp Max (°C)</span>
              </label>
              <input
                type="number"
                step="1"
                value={formThresholds.tempMaxC}
                onChange={(e) => setFormThresholds({ ...formThresholds, tempMaxC: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 70 °C upper drying limit</span>
            </div>

            {/* Min Fragrance % */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Droplets className="w-3.5 h-3.5 text-purple-400" />
                <span>Low Fragrance Level (%)</span>
              </label>
              <input
                type="number"
                step="1"
                value={formThresholds.fragranceMinPercent}
                onChange={(e) => setFormThresholds({ ...formThresholds, fragranceMinPercent: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Trigger refill warning (&lt;15%)</span>
            </div>

            {/* Min Battery % */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Battery className="w-3.5 h-3.5 text-amber-400" />
                <span>Low Battery SOC (%)</span>
              </label>
              <input
                type="number"
                step="1"
                value={formThresholds.batteryMinPercent}
                onChange={(e) => setFormThresholds({ ...formThresholds, batteryMinPercent: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Trigger low power warning (&lt;20%)</span>
            </div>

            {/* Target Weight Loss Min % */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Proper Drying Range (%)</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.5"
                  value={formThresholds.weightLossMinPercent}
                  onChange={(e) => setFormThresholds({ ...formThresholds, weightLossMinPercent: parseFloat(e.target.value) })}
                  className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="number"
                  step="0.5"
                  value={formThresholds.weightLossMaxPercent}
                  onChange={(e) => setFormThresholds({ ...formThresholds, weightLossMaxPercent: parseFloat(e.target.value) })}
                  className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Standard 20.0% - 25.0% loss</span>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Apply Threshold Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Localization & Theme Customization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Language Selection */}
        <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interface Language</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Select dashboard language for rural women operators and field supervisors.
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-xl border text-center font-semibold transition ${
                language === 'en' 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">English</div>
              <div className="text-[10px] text-slate-500 mt-0.5">EN (Default)</div>
            </button>

            <button
              onClick={() => setLanguage('ta')}
              className={`p-3 rounded-xl border text-center font-semibold transition ${
                language === 'ta' 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">தமிழ்</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Tamil</div>
            </button>

            <button
              onClick={() => setLanguage('hi')}
              className={`p-3 rounded-xl border text-center font-semibold transition ${
                language === 'hi' 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">हिंदी</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Hindi</div>
            </button>
          </div>
        </div>

        {/* Theme Customization */}
        <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-3">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Color Appearance</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Toggle high-contrast Dark Mode or Solar Bright Light Mode.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 font-bold transition ${
                theme === 'dark' 
                  ? 'bg-slate-950 border-emerald-500 text-emerald-300 shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Deep Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 font-bold transition ${
                theme === 'light' 
                  ? 'bg-slate-100 border-amber-500 text-slate-950 shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Clean Light Mode</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
