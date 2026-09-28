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
  SlidersHorizontal 
} from 'lucide-react';

export const MobileTabBar = () => {
  const { activeTab, setActiveTab, activeAlertCount } = useMachine();

  const primaryMobileTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'drying', label: 'Drying', icon: Flame },
    { id: 'power', label: 'Power', icon: BatteryCharging },
    { id: 'weights', label: 'Weights', icon: Scale },
    { id: 'fragrance', label: 'Fragrance', icon: Droplets },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertCount },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-1 py-1.5 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around">
        {primaryMobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-600 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[50px]">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-amber-400 rounded-full mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
