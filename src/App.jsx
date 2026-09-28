import React, { useState } from 'react';
import { MachineProvider, useMachine } from './context/MachineContext';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Sidebar } from './components/Sidebar';
import { MobileTabBar } from './components/MobileTabBar';
import { AlertBanner, AlertToast } from './components/AlertBanner';
import { DemoControlBar } from './components/DemoControlBar';
import { Footer } from './components/Footer';

// Pages
import { Dashboard } from './pages/Dashboard';
import { DryingMonitor } from './pages/DryingMonitor';
import { PowerBattery } from './pages/PowerBattery';
import { WeightAnalysis } from './pages/WeightAnalysis';
import { FragranceModule } from './pages/FragranceModule';
import { BatchesReports } from './pages/BatchesReports';
import { AlertsCenter } from './pages/AlertsCenter';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { WeightEntryModal } from './components/WeightEntryModal';
import { RefillModal } from './components/RefillModal';
import { Esp32HardwareModal } from './components/Esp32HardwareModal';

const AppContent = () => {
  const { activeTab, theme } = useMachine();

  // Modals state
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Global Persistent Alert Banner (Visible on all pages when active) */}
      <AlertBanner />

      {/* 2. Global Floating Alert Toast */}
      <AlertToast />

      {/* 3. Top Navigation Header */}
      <HeaderNavbar onOpenHardwareModal={() => setIsHardwareModalOpen(true)} />

      {/* 4. Judge / Demo Control Bar */}
      <DemoControlBar />

      {/* 5. Main Content Area with Sidebar Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        
        {/* Desktop / Tablet Sidebar */}
        <Sidebar onOpenHardwareModal={() => setIsHardwareModalOpen(true)} />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              onOpenWeightModal={() => setIsWeightModalOpen(true)} 
              onOpenRefillModal={() => setIsRefillModalOpen(true)} 
            />
          )}

          {activeTab === 'drying' && <DryingMonitor />}

          {activeTab === 'power' && <PowerBattery />}

          {activeTab === 'weights' && (
            <WeightAnalysis onOpenWeightModal={() => setIsWeightModalOpen(true)} />
          )}

          {activeTab === 'fragrance' && (
            <FragranceModule onOpenRefillModal={() => setIsRefillModalOpen(true)} />
          )}

          {activeTab === 'batches' && <BatchesReports />}

          {activeTab === 'alerts' && <AlertsCenter />}

          {activeTab === 'settings' && (
            <SettingsPage onOpenHardwareModal={() => setIsHardwareModalOpen(true)} />
          )}

          {/* Social Impact & Brand Footer */}
          <Footer />
        </main>
      </div>

      {/* 6. Mobile Fixed Bottom Navigation Bar */}
      <MobileTabBar />

      {/* 7. Interactive Modals */}
      <WeightEntryModal 
        isOpen={isWeightModalOpen} 
        onClose={() => setIsWeightModalOpen(false)} 
      />

      <RefillModal 
        isOpen={isRefillModalOpen} 
        onClose={() => setIsRefillModalOpen(false)} 
      />

      <Esp32HardwareModal 
        isOpen={isHardwareModalOpen} 
        onClose={() => setIsHardwareModalOpen(false)} 
      />

    </div>
  );
};

export function App() {
  return (
    <MachineProvider>
      <AppContent />
    </MachineProvider>
  );
}

export default App;
