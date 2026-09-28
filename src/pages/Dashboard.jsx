import React from 'react';
import { useMachine } from '../context/MachineContext';
import { StageStepper } from '../components/StageStepper';
import { CircularGauge } from '../components/GaugeCard';
import { FragranceTankGraphic } from '../components/FragranceTankGraphic';
import { EnergyFlowDiagram } from '../components/EnergyFlowDiagram';
import { 
  Thermometer, 
  Droplets, 
  BatteryCharging, 
  Zap, 
  Sun, 
  Scale, 
  Layers, 
  Package, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Plus
} from 'lucide-react';

export const Dashboard = ({ onOpenWeightModal, onOpenRefillModal }) => {
  const { 
    liveTelemetry, 
    batchSummary, 
    stickWeights, 
    setActiveTab, 
    cycleMinute, 
    t 
  } = useMachine();

  const isCurrentAlert = liveTelemetry.batteryCurrent >= 5.5;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Automated 4-Stage Process Pipeline */}
      <StageStepper />

      {/* 2. Top Telemetry Row: Chamber Temp & Humidity Gauges + Battery SOC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Chamber Temperature Gauge (Target 60-70°C) */}
        <CircularGauge
          value={liveTelemetry.chamberTemp}
          min={25}
          max={90}
          targetMin={60}
          targetMax={70}
          unit="°C"
          title="Chamber Temperature"
          subtitle="Target 60-70 °C"
          icon={Thermometer}
          type="temp"
          status={liveTelemetry.chamberTemp >= 60 && liveTelemetry.chamberTemp <= 70 ? 'OPTIMAL' : 'ADJUSTING'}
        />

        {/* Chamber Humidity Gauge */}
        <CircularGauge
          value={liveTelemetry.humidity}
          min={0}
          max={100}
          unit="%"
          title="Chamber Humidity"
          subtitle="Target < 35%"
          icon={Droplets}
          type="humidity"
          status={liveTelemetry.humidity <= 35 ? 'DRYING OPTIMAL' : 'HIGH MOISTURE'}
        />

        {/* Battery SOC & Current Draw */}
        <CircularGauge
          value={liveTelemetry.batterySoc}
          min={0}
          max={100}
          unit="%"
          title="Battery State of Charge"
          subtitle={`${liveTelemetry.batteryVoltage}V | ${liveTelemetry.batteryCurrent}A`}
          icon={BatteryCharging}
          type="battery"
          status={liveTelemetry.batterySoc >= 50 ? 'HEALTHY' : 'LOW STORAGE'}
        />

      </div>

      {/* 3. Core Operational Cards: Stick Weights & Loss + Fragrance Tank (1 L) + Counting/Packing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Stick Weight & Moisture Loss Card */}
        <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <Scale className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Stick Weight & Loss</h4>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {batchSummary.qualityTag}
              </span>
            </div>

            {/* Big readable totals */}
            <div className="grid grid-cols-3 gap-2 my-3 text-center bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Before</span>
                <span className="text-lg font-black text-white font-mono">{batchSummary.totalWeightBefore} g</span>
                <span className="text-[9px] text-slate-500 block">5 Sticks</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">After</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{batchSummary.totalWeightAfter} g</span>
                <span className="text-[9px] text-emerald-500 block">Dried</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 block uppercase font-mono">Loss</span>
                <span className="text-lg font-black text-amber-400 font-mono">{batchSummary.lossPercentage}%</span>
                <span className="text-[9px] text-amber-500 block">(-{batchSummary.totalWeightLoss} g)</span>
              </div>
            </div>

            {/* Target 20-25% progress bar */}
            <div className="space-y-1 my-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Loss Progress: {batchSummary.lossPercentage}%</span>
                <span className="text-emerald-400 font-semibold">Target: 20% - 25%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                {/* Target window highlight */}
                <div className="absolute left-[20%] right-[75%] top-0 bottom-0 bg-emerald-500/30"></div>
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, (batchSummary.lossPercentage / 30) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('weights')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
            >
              <span>View All Sticks (S1-S5)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenWeightModal}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          </div>
        </div>

        {/* Fragrance Tank Visual (1 L) */}
        <FragranceTankGraphic onOpenRefillModal={onOpenRefillModal} />

        {/* Optical Counting & Packaging Card */}
        <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/30">
                  <Package className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Counting & Packaging</h4>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40">
                1 Pack (5/5)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Sticks Counted</span>
                <span className="text-2xl font-black text-white font-mono my-1 block">
                  5 <span className="text-sm font-normal text-slate-500">/ 5</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">● IR Sensor Validated</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Packs Sealed</span>
                <span className="text-2xl font-black text-amber-400 font-mono my-1 block">
                  1 <span className="text-sm font-normal text-slate-500">Pack</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Heat Sealed (Eco-pack)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] space-y-1 font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Batch ID:</span>
                <span className="text-slate-200 font-bold">{batchSummary.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span>Operator:</span>
                <span className="text-emerald-400 font-semibold">Lakshmi Devi (SHG Lead)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Target Efficiency: 100%</span>
            <button
              onClick={() => setActiveTab('batches')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>Batch Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Energy Flow & Power Telemetry */}
      <EnergyFlowDiagram />

    </div>
  );
};
