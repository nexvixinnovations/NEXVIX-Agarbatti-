import React from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  LayoutDashboard, 
  Flame, 
  BatteryCharging, 
  Scale, 
  Droplets, 
  FileSpreadsheet, 
  Bell, 
  SlidersHorizontal,
  Cpu,
  ChevronRight,
  SunMedium,
  HeartHandshake
} from 'lucide-react';

export const Sidebar = ({ onOpenHardwareModal }) => {
  const { activeTab, setActiveTab, t, activeAlertCount, liveTelemetry } = useMachine();

  const navigationItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'drying', label: t('dryingMonitor'), icon: Flame, badge: `${liveTelemetry.chamberTemp}°C` },
    { id: 'power', label: t('powerBattery'), icon: BatteryCharging, badge: `${liveTelemetry.batterySoc}%` },
    { id: 'weights', label: t('weightAnalysis'), icon: Scale, badge: '5 Sticks' },
    { id: 'fragrance', label: t('fragranceModule'), icon: Droplets, badge: '99.8%' },
    { id: 'batches', label: t('batchesReports'), icon: FileSpreadsheet, badge: null },
    { 
      id: 'alerts', 
      label: t('alertsCenter'), 
      icon: Bell, 
      badge: activeAlertCount > 0 ? `${activeAlertCount} Alert` : null,
      badgeColor: activeAlertCount > 0 ? 'bg-red-500 text-white animate-pulse' : null
    },
    { id: 'settings', label: t('settings'), icon: SlidersHorizontal, badge: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-slate-900/70 dark:bg-slate-950/70 border-r border-slate-800 p-4 shrink-0 select-none min-h-[calc(100vh-4rem)]">
      
      {/* Quick Machine Identification Card */}
      <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-md">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>NEXVIX-09 ONLINE</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
            ESP32-S3
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Anandi SHG Micro-Factory • Vellore
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-300">
          <span className="text-amber-400 flex items-center space-x-1">
            <SunMedium className="w-3 h-3 text-amber-400" />
            <span>{liveTelemetry.solarP}W Solar</span>
          </span>
          <span className="text-emerald-400">{liveTelemetry.batteryVoltage}V ({liveTelemetry.batterySoc}%)</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition group ${
                isActive
                  ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-amber-400 scale-110' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Rural Women Empowerment & Social Impact Footer Mini Banner */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/30 to-emerald-950/30 border border-amber-500/20 text-slate-300 text-xs flex items-start space-x-2.5">
          <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200 text-[11px]">Empowering Artisans</p>
            <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
              Solar smart technology uplifting rural women SHGs with 3.5x higher yield & pure consistency.
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
};
