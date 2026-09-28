import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  Radio, 
  Cpu, 
  Sparkles, 
  Activity,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Zap,
  Menu,
  X
} from 'lucide-react';

export const HeaderNavbar = ({ onOpenHardwareModal }) => {
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t, 
    activeAlertCount, 
    setActiveTab, 
    activeTab,
    hardwareConfig,
    liveTelemetry 
  } = useMachine();

  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {/* Custom Modern Sun + Leaf "N" Logo */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-0.5 shadow-lg border border-emerald-500/40 group-hover:border-amber-400/80 transition flex items-center justify-center glow-green">
              <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow">
                {/* Solar Sun Rays in Amber */}
                <circle cx="20" cy="20" r="14" fill="#0F5132" />
                <path d="M20 3 L20 6 M20 34 L20 37 M3 20 L6 20 M34 20 L37 20 M8 8 L10 10 M30 30 L32 32 M8 32 L10 30 M30 8 L32 10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                {/* Modern stylized Leaf/N glyph */}
                <path 
                  d="M13 27 V13 L24 23.5 V13 H27 V27 L16 16.5 V27 H13 Z" 
                  fill="#F59E0B" 
                />
                {/* Eco Leaf Accent dot in Emerald */}
                <circle cx="27" cy="13" r="3" fill="#10B981" />
              </svg>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight font-sans bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-300 bg-clip-text text-transparent">
                  NEXVIX
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Solar Agarbatti IoT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium tracking-wide">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Center Hardware / Power Telemetry Pills (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            {/* Live Connection Pill */}
            <div 
              onClick={onOpenHardwareModal}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition shadow-inner"
              title="Click to view ESP32 hardware config & live packets"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-slate-300 font-medium">ESP32-S3</span>
              <span className="text-slate-500 font-mono text-[10px]">{hardwareConfig.lastPingMs}ms</span>
            </div>

            {/* Solar Generation Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 shadow-inner font-mono">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Solar: {liveTelemetry.solarP} W</span>
            </div>

            {/* Battery SOC Pill */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border shadow-inner font-mono ${
              liveTelemetry.batterySoc < 20 
                ? 'bg-red-950/50 border-red-500/40 text-red-400 animate-pulse' 
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            }`}>
              <Zap className="w-3.5 h-3.5" />
              <span>Bat: {liveTelemetry.batterySoc}% ({liveTelemetry.batteryVoltage}V)</span>
            </div>
          </div>

          {/* Right Actions: Lang, Theme, Alerts, Hardware */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center space-x-1.5 text-xs font-semibold"
                title="Change language (English / Tamil / Hindi)"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="uppercase font-mono hidden xs:inline">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs backdrop-blur-xl">
                  <button
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                      language === 'en' ? 'text-emerald-400 font-bold bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>English (EN)</span>
                    {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('ta'); setShowLangMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                      language === 'ta' ? 'text-emerald-400 font-bold bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>தமிழ் (Tamil)</span>
                    {language === 'ta' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                      language === 'hi' ? 'text-emerald-400 font-bold bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Hardware Modal Button */}
            <button
              onClick={onOpenHardwareModal}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-emerald-400 transition"
              title="ESP32 IoT Hub & Protocols"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Alerts Center Button */}
            <button
              onClick={() => setActiveTab('alerts')}
              className={`p-2 rounded-xl border relative transition flex items-center justify-center ${
                activeAlertCount > 0 
                  ? 'bg-red-950/60 border-red-500/60 text-red-400 glow-red' 
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title="View Alerts & System Health"
            >
              <Bell className="w-4 h-4" />
              {activeAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {activeAlertCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
