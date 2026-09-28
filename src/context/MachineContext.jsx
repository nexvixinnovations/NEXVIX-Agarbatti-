import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  initialStickWeights, 
  batchWeightSummary, 
  dryingCycleLog, 
  batteryPowerLog, 
  fragranceModuleData, 
  initialMachineState, 
  alertThresholds, 
  historicalBatches, 
  initialAlerts 
} from '../data/mockData';
import { translations } from '../data/translations';

const MachineContext = createContext(null);

export const useMachine = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachine must be used within a MachineProvider');
  }
  return context;
};

export const MachineProvider = ({ children }) => {
  // Theme & Language
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Simulation & Cycle Playback State
  const [cycleMinute, setCycleMinute] = useState(40); // default at 40 min where the 6.9A alert is present
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStageIndex, setActiveStageIndex] = useState(0); // 0: drying, 1: fragrance, 2: counting, 3: packaging

  // Thresholds
  const [thresholds, setThresholds] = useState(alertThresholds);

  // Sticks & Batch Weights
  const [stickWeights, setStickWeights] = useState(initialStickWeights);
  const [batchSummary, setBatchSummary] = useState(batchWeightSummary);
  const [batches, setBatches] = useState(historicalBatches);

  // Fragrance
  const [fragranceState, setFragranceState] = useState(fragranceModuleData);

  // Alerts
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeToast, setActiveToast] = useState(null);

  // Hardware Connection State
  const [hardwareConfig, setHardwareConfig] = useState({
    protocol: 'SIMULATION', // SIMULATION | WEBSOCKET | MQTT | REST
    esp32Ip: '192.168.4.1',
    port: 81,
    mqttBroker: 'wss://broker.emqx.io:8084/mqtt',
    mqttTopic: 'nexvix/machine/telemetry',
    isConnected: true,
    lastPingMs: 18,
    packetsReceived: 1420
  });

  // Derived telemetry based on cycleMinute with live jitter
  const [liveJitter, setLiveJitter] = useState({ tempJitter: 0, currJitter: 0, humJitter: 0 });

  // Apply Theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Helper to interpolate drying telemetry by minute
  const getInterpolatedTelemetry = useCallback((minute) => {
    const clampedMin = Math.max(0, Math.min(60, minute));
    
    // Find enclosing points in dryingCycleLog
    let prevPoint = dryingCycleLog[0];
    let nextPoint = dryingCycleLog[dryingCycleLog.length - 1];

    for (let i = 0; i < dryingCycleLog.length - 1; i++) {
      if (clampedMin >= dryingCycleLog[i].minute && clampedMin <= dryingCycleLog[i + 1].minute) {
        prevPoint = dryingCycleLog[i];
        nextPoint = dryingCycleLog[i + 1];
        break;
      }
    }

    const range = nextPoint.minute - prevPoint.minute || 1;
    const factor = (clampedMin - prevPoint.minute) / range;

    const temp = Number((prevPoint.temp + factor * (nextPoint.temp - prevPoint.temp)).toFixed(1));
    const humidity = Number((prevPoint.humidity + factor * (nextPoint.humidity - prevPoint.humidity)).toFixed(1));
    const trayWeight = Number((prevPoint.trayWeight + factor * (nextPoint.trayWeight - prevPoint.trayWeight)).toFixed(2));
    const heater = clampedMin >= 60 ? 'OFF' : (clampedMin >= 40 ? 'Pulsing' : 'ON');
    const fan = clampedMin >= 50 ? 'High' : (clampedMin >= 20 ? 'Medium' : 'Low');

    // Battery / Power telemetry
    let prevBatt = batteryPowerLog[0];
    let nextBatt = batteryPowerLog[batteryPowerLog.length - 1];
    for (let i = 0; i < batteryPowerLog.length - 1; i++) {
      if (clampedMin >= batteryPowerLog[i].minute && clampedMin <= batteryPowerLog[i + 1].minute) {
        prevBatt = batteryPowerLog[i];
        nextBatt = batteryPowerLog[i + 1];
        break;
      }
    }

    const battFactor = (clampedMin - prevBatt.minute) / (nextBatt.minute - prevBatt.minute || 1);
    
    // Keep the distinct spike at minute 40
    let current;
    if (Math.abs(clampedMin - 40) < 1.5) {
      current = 6.9;
    } else {
      current = Number((prevBatt.current + battFactor * (nextBatt.current - prevBatt.current)).toFixed(2));
    }

    const voltage = Number((prevBatt.voltage + battFactor * (nextBatt.voltage - prevBatt.voltage)).toFixed(2));
    const power = Number((current * voltage).toFixed(1));
    const solarV = Number((prevBatt.solarVoltage + battFactor * (nextBatt.solarVoltage - prevBatt.solarVoltage)).toFixed(1));
    const solarI = Number((prevBatt.solarCurrent + battFactor * (nextBatt.solarCurrent - prevBatt.solarCurrent)).toFixed(2));
    const solarP = Number((solarV * solarI).toFixed(1));
    const batterySoc = Math.max(10, Math.round(98 - (clampedMin / 60) * 12));

    return {
      temp,
      humidity,
      trayWeight,
      heater,
      fan,
      current,
      voltage,
      power,
      solarV,
      solarI,
      solarP,
      batterySoc,
      netBalanceW: Number((solarP - power).toFixed(1))
    };
  }, []);

  // Continuous live cycle timer & 2-second telemetry variations
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Live micro-fluctuation jitter
      const tJitter = (Math.random() - 0.5) * 0.3;
      const cJitter = (Math.random() - 0.5) * 0.08;
      const hJitter = (Math.random() - 0.5) * 0.4;
      setLiveJitter({ tempJitter: tJitter, currJitter: cJitter, humJitter: hJitter });

      // 2. Hardware packet counter tick
      setHardwareConfig(prev => ({
        ...prev,
        packetsReceived: prev.packetsReceived + 1,
        lastPingMs: 15 + Math.floor(Math.random() * 8)
      }));

      // 3. Playback cycle advancing
      if (isPlaying) {
        setCycleMinute(prev => {
          const next = prev + 0.25 * playbackSpeed;
          if (next >= 60) {
            // Stage progression when cycle reaches 60 min
            return 60;
          }
          return Number(next.toFixed(2));
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Derive stage from cycle minute if in automatic mode
  useEffect(() => {
    if (cycleMinute < 60) {
      setActiveStageIndex(0); // Drying
    } else if (cycleMinute >= 60 && fragranceState.batchSprayedMl < 2.5) {
      setActiveStageIndex(1); // Fragrance
    } else if (batchSummary.totalSticks < 5) {
      setActiveStageIndex(2); // Counting
    } else {
      setActiveStageIndex(3); // Packaging
    }
  }, [cycleMinute, fragranceState.batchSprayedMl, batchSummary.totalSticks]);

  // Compute live active telemetry values
  const baseTelemetry = getInterpolatedTelemetry(cycleMinute);
  const liveTelemetry = {
    ...baseTelemetry,
    chamberTemp: Number((baseTelemetry.temp + liveJitter.tempJitter).toFixed(1)),
    humidity: Number((baseTelemetry.humidity + liveJitter.humJitter).toFixed(1)),
    batteryCurrent: Number((baseTelemetry.current + liveJitter.currJitter).toFixed(2)),
    batteryPower: Number(((baseTelemetry.current + liveJitter.currJitter) * baseTelemetry.voltage).toFixed(1)),
    cycleMinute: Math.floor(cycleMinute),
    cycleSecond: Math.floor((cycleMinute % 1) * 60),
    stickLossG: Number((9.32 - baseTelemetry.trayWeight).toFixed(2)),
    stickLossPct: Number((((9.32 - baseTelemetry.trayWeight) / 9.32) * 100).toFixed(1)),
  };

  // Check alert conditions against thresholds
  const checkAutomaticAlerts = useCallback(() => {
    const newAlerts = [...alerts];
    let triggeredToast = null;

    // 1. Check Uneven Current Alert (spike >= 5.5A or 6.9A)
    const isCurrentSpike = liveTelemetry.batteryCurrent >= thresholds.currentMaxSafeAmps;
    const existingCurrAlert = newAlerts.find(a => a.faultCode === 'ERR-CURR-040');
    
    if (isCurrentSpike) {
      if (!existingCurrAlert) {
        const alt = {
          id: `ALT-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'critical',
          category: 'POWER_SYSTEM',
          title: 'Uneven Current Alert (6.9 A spike)',
          message: `Current surge of ${liveTelemetry.batteryCurrent}A detected (+56.8% fluctuation). Heating relay pulsed spike detected.`,
          faultCode: 'ERR-CURR-040',
          stage: 'Drying Phase',
          acknowledged: false,
          active: true
        };
        newAlerts.unshift(alt);
        triggeredToast = alt;
      }
    } else if (existingCurrAlert && !existingCurrAlert.acknowledged && cycleMinute < 38) {
      // Deactivate if scrubbed away from minute 40
      existingCurrAlert.active = false;
    }

    // 2. Check Fragrance Tank Low Alert
    const isLowFragrance = fragranceState.levelPercent < thresholds.fragranceMinPercent;
    const existingFragAlert = newAlerts.find(a => a.faultCode === 'ERR-FRAG-LOW');
    if (isLowFragrance && !existingFragAlert) {
      const alt = {
        id: `ALT-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'warning',
        category: 'FRAGRANCE_SYSTEM',
        title: 'Low Fragrance Level (< 15%)',
        message: `Fragrance tank level dropped to ${fragranceState.currentLevelMl} ml (${fragranceState.levelPercent}%). Please refill soon.`,
        faultCode: 'ERR-FRAG-LOW',
        stage: 'Fragrance Spray',
        acknowledged: false,
        active: true
      };
      newAlerts.unshift(alt);
      triggeredToast = alt;
    }

    // 3. Check Battery Low Alert
    const isLowBatt = liveTelemetry.batterySoc < thresholds.batteryMinPercent;
    const existingBattAlert = newAlerts.find(a => a.faultCode === 'ERR-BATT-LOW');
    if (isLowBatt && !existingBattAlert) {
      const alt = {
        id: `ALT-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'critical',
        category: 'POWER_SYSTEM',
        title: 'Critical Low Battery (< 20%)',
        message: `Battery SOC is at ${liveTelemetry.batterySoc}%. Connect high-efficiency solar panel array.`,
        faultCode: 'ERR-BATT-LOW',
        stage: 'Power Management',
        acknowledged: false,
        active: true
      };
      newAlerts.unshift(alt);
      triggeredToast = alt;
    }

    setAlerts(newAlerts);
    if (triggeredToast) {
      setActiveToast(triggeredToast);
    }
  }, [liveTelemetry.batteryCurrent, liveTelemetry.batterySoc, fragranceState.levelPercent, thresholds, cycleMinute, alerts]);

  // Run alert check periodically
  useEffect(() => {
    checkAutomaticAlerts();
  }, [cycleMinute]);

  // Actions for Demo & Judges
  const triggerDemoAlert = (type) => {
    let alt;
    if (type === 'CURRENT') {
      setCycleMinute(40);
      alt = {
        id: `ALT-MANUAL-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'critical',
        category: 'POWER_SYSTEM',
        title: 'FORCED: Uneven Current Alert (6.9 A)',
        message: 'Current rapid fluctuation +56.8% triggered via Judge Demo Panel.',
        faultCode: 'ERR-CURR-040',
        stage: 'Drying Phase',
        acknowledged: false,
        active: true
      };
    } else if (type === 'FRAGRANCE') {
      setFragranceState(prev => ({
        ...prev,
        currentLevelMl: 120.0,
        levelPercent: 12.0
      }));
      alt = {
        id: `ALT-MANUAL-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'warning',
        category: 'FRAGRANCE_SYSTEM',
        title: 'FORCED: Fragrance Tank Critically Low (12%)',
        message: 'Tank volume dropped below 150ml threshold. Refill required.',
        faultCode: 'ERR-FRAG-LOW',
        stage: 'Fragrance Spray',
        acknowledged: false,
        active: true
      };
    } else if (type === 'BATTERY') {
      alt = {
        id: `ALT-MANUAL-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'critical',
        category: 'POWER_SYSTEM',
        title: 'FORCED: Low Battery SOC Alert (14%)',
        message: 'Battery voltage dropped to 11.2V. Switched to emergency solar conservation.',
        faultCode: 'ERR-BATT-LOW',
        stage: 'Power Management',
        acknowledged: false,
        active: true
      };
    } else if (type === 'TEMP_HIGH') {
      alt = {
        id: `ALT-MANUAL-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'warning',
        category: 'CHAMBER_TEMP',
        title: 'FORCED: Chamber Temperature Exceeded (74.2 °C)',
        message: 'Temperature exceeds upper threshold of 70.0 °C. Auto pulsed exhaust activated.',
        faultCode: 'ERR-TEMP-HIGH',
        stage: 'Drying Phase',
        acknowledged: false,
        active: true
      };
    }
    
    if (alt) {
      setAlerts(prev => [alt, ...prev.filter(a => a.faultCode !== alt.faultCode)]);
      setActiveToast(alt);
    }
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, active: false } : a));
    if (activeToast && activeToast.id === id) {
      setActiveToast(null);
    }
  };

  const clearAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true, active: false })));
    setActiveToast(null);
  };

  const resetToBaseline = () => {
    setCycleMinute(0);
    setIsPlaying(true);
    setPlaybackSpeed(1);
    setStickWeights(initialStickWeights);
    setBatchSummary(batchWeightSummary);
    setFragranceState(fragranceModuleData);
    setAlerts(initialAlerts.map(a => ({ ...a, acknowledged: true, active: false })));
    setActiveToast(null);
  };

  // Add new stick weight record
  const addStickWeightRecord = (beforeW, afterW) => {
    const bW = parseFloat(beforeW);
    const aW = parseFloat(afterW);
    if (isNaN(bW) || isNaN(aW) || bW <= 0 || aW <= 0) return null;

    const lossW = Number((bW - aW).toFixed(2));
    const lossPct = Number(((lossW / bW) * 100).toFixed(2));
    
    let quality = 'Properly Dried';
    if (lossPct < thresholds.weightLossMinPercent) quality = 'Under-dried';
    else if (lossPct > thresholds.weightLossMaxPercent) quality = 'Over-dried';

    const newStick = {
      id: `S${stickWeights.length + 1}`,
      stickNumber: stickWeights.length + 1,
      beforeWeight: bW,
      afterWeight: aW,
      lossWeight: lossW,
      lossPercent: lossPct,
      status: quality
    };

    const updatedSticks = [...stickWeights, newStick];
    setStickWeights(updatedSticks);

    // Recalculate totals
    const totB = updatedSticks.reduce((acc, s) => acc + s.beforeWeight, 0);
    const totA = updatedSticks.reduce((acc, s) => acc + s.afterWeight, 0);
    const totLoss = totB - totA;
    const avgLossPct = (totLoss / totB) * 100;

    let overallTag = 'Properly Dried';
    if (avgLossPct < thresholds.weightLossMinPercent) overallTag = 'Under-dried';
    else if (avgLossPct > thresholds.weightLossMaxPercent) overallTag = 'Over-dried';

    setBatchSummary(prev => ({
      ...prev,
      totalSticks: updatedSticks.length,
      totalWeightBefore: Number(totB.toFixed(2)),
      totalWeightAfter: Number(totA.toFixed(2)),
      totalWeightLoss: Number(totLoss.toFixed(2)),
      lossPercentage: Number(avgLossPct.toFixed(2)),
      qualityTag: overallTag
    }));

    return newStick;
  };

  // Refill Fragrance Tank
  const logRefill = (addedMl, technician, note) => {
    const current = fragranceState.currentLevelMl;
    const capacity = fragranceState.tankCapacityMl;
    const newTotal = Math.min(capacity, current + Number(addedMl));
    const newPct = Number(((newTotal / capacity) * 100).toFixed(2));

    const newLog = {
      id: `REF-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      addedMl: Number(addedMl),
      technician: technician || 'Lakshmi Devi (SHG Lead)',
      note: note || 'Routine solar aromatic refill'
    };

    setFragranceState(prev => ({
      ...prev,
      currentLevelMl: newTotal,
      levelPercent: newPct,
      refillHistory: [newLog, ...prev.refillHistory]
    }));

    // Clear low fragrance alert if resolved
    if (newPct >= thresholds.fragranceMinPercent) {
      setAlerts(prev => prev.map(a => a.faultCode === 'ERR-FRAG-LOW' ? { ...a, acknowledged: true, active: false } : a));
    }
  };

  // Active Critical/Warning Alerts
  const activeAlertCount = alerts.filter(a => a.active && !a.acknowledged).length;
  const activeCriticalAlert = alerts.find(a => a.active && !a.acknowledged && a.severity === 'critical');
  const activeAlert = alerts.find(a => a.active && !a.acknowledged);

  // Localization helper
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <MachineContext.Provider value={{
      theme,
      setTheme,
      language,
      setLanguage,
      t,
      activeTab,
      setActiveTab,
      
      // Simulation
      cycleMinute,
      setCycleMinute,
      playbackSpeed,
      setPlaybackSpeed,
      isPlaying,
      setIsPlaying,
      activeStageIndex,
      setActiveStageIndex,
      
      // Live & Derived Telemetry
      liveTelemetry,
      dryingCycleLog,
      batteryPowerLog,
      
      // Stick weights & batch
      stickWeights,
      batchSummary,
      addStickWeightRecord,
      batches,
      setBatches,
      
      // Fragrance
      fragranceState,
      logRefill,
      
      // Alerts
      alerts,
      activeAlertCount,
      activeCriticalAlert,
      activeAlert,
      activeToast,
      setActiveToast,
      acknowledgeAlert,
      clearAllAlerts,
      triggerDemoAlert,
      resetToBaseline,
      
      // Thresholds
      thresholds,
      setThresholds,
      
      // Hardware
      hardwareConfig,
      setHardwareConfig,
    }}>
      {children}
    </MachineContext.Provider>
  );
};
