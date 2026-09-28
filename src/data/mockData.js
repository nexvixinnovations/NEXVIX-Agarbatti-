/**
 * NEXVIX - Smart Solar Agarbatti Processing System
 * Core Mock Data & Historical Telemetry Logs
 * 
 * Includes 5-stick test batch dataset, 60-minute drying cycle telemetry,
 * 12V battery power logs, fragrance usage logs, and historical batch records.
 */

// 1. 5-Stick Weight Data (Baseline 60-70 °C drying test batch)
export const initialStickWeights = [
  { id: 'S1', stickNumber: 1, beforeWeight: 1.85, afterWeight: 1.42, lossWeight: 0.43, lossPercent: 23.24, status: 'Properly Dried' },
  { id: 'S2', stickNumber: 2, beforeWeight: 1.90, afterWeight: 1.46, lossWeight: 0.44, lossPercent: 23.16, status: 'Properly Dried' },
  { id: 'S3', stickNumber: 3, beforeWeight: 1.82, afterWeight: 1.40, lossWeight: 0.42, lossPercent: 23.08, status: 'Properly Dried' },
  { id: 'S4', stickNumber: 4, beforeWeight: 1.88, afterWeight: 1.45, lossWeight: 0.43, lossPercent: 22.87, status: 'Properly Dried' },
  { id: 'S5', stickNumber: 5, beforeWeight: 1.87, afterWeight: 1.44, lossWeight: 0.43, lossPercent: 22.99, status: 'Properly Dried' },
];

export const batchWeightSummary = {
  batchId: 'BATCH-2026-0928-01',
  totalSticks: 5,
  totalWeightBefore: 9.32,
  totalWeightAfter: 7.17,
  totalWeightLoss: 2.15,
  lossPercentage: 23.07, // 2.15 / 9.32 * 100
  targetLossRange: { min: 20.0, max: 25.0 },
  qualityTag: 'Properly Dried',
  qualityGrade: 'Grade A Premium',
  targetTempRange: '60 - 70 °C',
};

// 2. 60-Minute Drying Telemetry Log (Minute, Temp °C, Humidity %, Heater, Fan, Tray Weight g)
export const dryingCycleLog = [
  { minute: 0,  temp: 32, humidity: 68, heater: 'ON',      fan: 'Low',    trayWeight: 9.32, heaterPowerPct: 100, fanRpm: 1200 },
  { minute: 10, temp: 48, humidity: 55, heater: 'ON',      fan: 'Low',    trayWeight: 8.95, heaterPowerPct: 100, fanRpm: 1200 },
  { minute: 20, temp: 60, humidity: 42, heater: 'ON',      fan: 'Medium', trayWeight: 8.60, heaterPowerPct: 80,  fanRpm: 2200 },
  { minute: 30, temp: 64, humidity: 33, heater: 'ON',      fan: 'Medium', trayWeight: 8.22, heaterPowerPct: 75,  fanRpm: 2200 },
  { minute: 40, temp: 67, humidity: 26, heater: 'Pulsing', fan: 'Medium', trayWeight: 7.85, heaterPowerPct: 50,  fanRpm: 2400 },
  { minute: 50, temp: 69, humidity: 21, heater: 'Pulsing', fan: 'High',   trayWeight: 7.50, heaterPowerPct: 40,  fanRpm: 3200 },
  { minute: 60, temp: 66, humidity: 18, heater: 'OFF',     fan: 'High',   trayWeight: 7.17, heaterPowerPct: 0,   fanRpm: 3400 },
];

// 3. 12V Battery & Solar Power Log (Minute, Current A, Voltage V, Power W, Status)
export const batteryPowerLog = [
  { 
    minute: 0,  
    current: 3.8, 
    voltage: 12.4, 
    power: 47.1, 
    status: 'Normal', 
    solarVoltage: 18.6, 
    solarCurrent: 3.2, 
    solarPower: 59.5,
    batterySoc: 98,
    isAlert: false
  },
  { 
    minute: 10, 
    current: 4.2, 
    voltage: 12.3, 
    power: 51.7, 
    status: 'Normal', 
    solarVoltage: 18.8, 
    solarCurrent: 3.6, 
    solarPower: 67.7,
    batterySoc: 96,
    isAlert: false
  },
  { 
    minute: 20, 
    current: 4.5, 
    voltage: 12.3, 
    power: 55.4, 
    status: 'Normal', 
    solarVoltage: 19.1, 
    solarCurrent: 4.0, 
    solarPower: 76.4,
    batterySoc: 94,
    isAlert: false
  },
  { 
    minute: 30, 
    current: 4.4, 
    voltage: 12.2, 
    power: 53.7, 
    status: 'Normal', 
    solarVoltage: 19.0, 
    solarCurrent: 3.9, 
    solarPower: 74.1,
    batterySoc: 92,
    isAlert: false
  },
  { 
    minute: 40, 
    current: 6.9, 
    voltage: 12.0, 
    power: 82.8, 
    status: 'UNEVEN CURRENT ALERT', 
    solarVoltage: 18.4, 
    solarCurrent: 3.5, 
    solarPower: 64.4,
    batterySoc: 89,
    isAlert: true,
    alertReason: 'Rapid fluctuation > +20% detected (Current spiked from 4.4A to 6.9A)'
  },
  { 
    minute: 50, 
    current: 4.3, 
    voltage: 12.2, 
    power: 52.5, 
    status: 'Normal', 
    solarVoltage: 18.9, 
    solarCurrent: 3.7, 
    solarPower: 69.9,
    batterySoc: 87,
    isAlert: false
  },
  { 
    minute: 60, 
    current: 1.2, 
    voltage: 12.5, 
    power: 15.0, 
    status: 'Normal (heater off)', 
    solarVoltage: 18.7, 
    solarCurrent: 2.8, 
    solarPower: 52.4,
    batterySoc: 86,
    isAlert: false
  },
];

// 4. Fragrance Module Specifications & Data
export const fragranceModuleData = {
  tankCapacityMl: 1000,
  initialLevelMl: 1000,
  currentLevelMl: 997.5,
  levelPercent: 99.75,
  mlPerStick: 0.5,
  batchSprayedMl: 2.5, // 5 sticks * 0.5 ml
  lowLevelThresholdPercent: 15,
  fragranceType: 'Mysore Sandalwood & Rose Pure Extract',
  flowRateMlMin: 12.5,
  pumpPressureBar: 2.2,
  nozzleStatus: 'Optimal Atomization',
  refillHistory: [
    { id: 'REF-01', date: '2026-09-27 16:30', addedMl: 500, technician: 'Lakshmi Devi (SHG Lead)', note: 'Routine top-up with Sandalwood Oil concentrate' },
    { id: 'REF-02', date: '2026-09-24 09:15', addedMl: 800, technician: 'Sunita Sharma', note: 'Tank cleaning & batch aroma calibration' },
  ]
};

// 5. Machine Process Stages
export const processStages = [
  { id: 'drying', label: 'Solar Drying', code: 'STAGE_01', desc: 'Solar-thermal infrared & forced convection', targetTemp: '60-70°C' },
  { id: 'spraying', label: 'Fragrance Spray', code: 'STAGE_02', desc: 'Precision micro-mist atomization (0.5ml/stick)', targetDose: '2.5ml / batch' },
  { id: 'counting', label: 'Optical Counting', code: 'STAGE_03', desc: 'IR Beam array optical detection', countTarget: '5 / 5 sticks' },
  { id: 'packaging', label: 'Automated Pack', code: 'STAGE_04', desc: 'Eco-paper wrapping & heat seal', packTarget: '1 Pack (5 sticks)' }
];

// 6. Real-time Initial Machine State
export const initialMachineState = {
  machineId: 'NEXVIX-SOLAR-09',
  firmwareVersion: 'v2.4.1-esp32-s3',
  activeStageIndex: 0, // 0: drying, 1: spraying, 2: counting, 3: packaging
  cycleMinute: 40, // default loaded at the alert minute or 0
  chamberTemp: 67.0,
  targetTempMin: 60.0,
  targetTempMax: 70.0,
  humidity: 26.0,
  targetHumidityMax: 45.0,
  trayWeight: 7.85,
  initialTrayWeight: 9.32,
  batteryCurrent: 6.9, // A
  batteryVoltage: 12.0, // V
  batteryPower: 82.8, // W
  batterySoc: 89, // %
  solarVoltage: 18.4,
  solarCurrent: 3.5,
  solarPower: 64.4,
  dailySolarEnergyWh: 420.5,
  cycleEnergyWh: 49.8,
  heaterStatus: 'Pulsing',
  fanStatus: 'Medium',
  fanRpm: 2400,
  fragranceRemainingMl: 997.5,
  fragranceLevelPercent: 99.75,
  fragranceSprayedBatchMl: 2.5,
  sticksCounted: 5,
  stickBatchTarget: 5,
  packsCompleted: 1,
  packTarget: 1,
  powerSource: 'Solar + Battery Hybrid',
  netPowerBalanceW: -18.4, // Solar(64.4W) - Consumption(82.8W)
  estimatedRuntimeMinutes: 380, // ~6.3 hours
  isOnline: true,
  lastHeartbeat: 'Just now',
  operatorName: 'Anandi SHG Unit #3',
  location: 'Vellore Solar Micro-Factory, TN'
};

// 7. System Alert Rules & Thresholds
export const alertThresholds = {
  currentFluctuationPercent: 20.0,
  currentMaxSafeAmps: 5.5,
  tempMinC: 60.0,
  tempMaxC: 70.0,
  humidityMaxPercent: 45.0,
  fragranceMinPercent: 15.0,
  batteryMinPercent: 20.0,
  weightLossMinPercent: 20.0,
  weightLossMaxPercent: 25.0
};

// 8. Historical Batch Logs
export const historicalBatches = [
  {
    id: 'BATCH-2026-0928-01',
    timestamp: '2026-09-28 09:30',
    sticksCount: 5,
    packsCompleted: 1,
    beforeWeight: 9.32,
    afterWeight: 7.17,
    lossGrams: 2.15,
    lossPercent: 23.07,
    qualityTag: 'Properly Dried',
    fragranceDosedMl: 2.5,
    energyUsedWh: 49.8,
    solarSharePct: 78.4,
    avgTemp: 64.2,
    operator: 'Lakshmi Devi',
    status: 'Completed'
  },
  {
    id: 'BATCH-2026-0928-02',
    timestamp: '2026-09-28 08:15',
    sticksCount: 50,
    packsCompleted: 10,
    beforeWeight: 93.4,
    afterWeight: 71.8,
    lossGrams: 21.6,
    lossPercent: 23.12,
    qualityTag: 'Properly Dried',
    fragranceDosedMl: 25.0,
    energyUsedWh: 51.2,
    solarSharePct: 84.0,
    avgTemp: 65.1,
    operator: 'Sunita Sharma',
    status: 'Completed'
  },
  {
    id: 'BATCH-2026-0927-09',
    timestamp: '2026-09-27 16:45',
    sticksCount: 50,
    packsCompleted: 10,
    beforeWeight: 94.0,
    afterWeight: 73.1,
    lossGrams: 20.9,
    lossPercent: 22.23,
    qualityTag: 'Properly Dried',
    fragranceDosedMl: 25.0,
    energyUsedWh: 48.6,
    solarSharePct: 91.5,
    avgTemp: 66.8,
    operator: 'Kavitha R',
    status: 'Completed'
  },
  {
    id: 'BATCH-2026-0927-08',
    timestamp: '2026-09-27 14:20',
    sticksCount: 25,
    packsCompleted: 5,
    beforeWeight: 47.1,
    afterWeight: 38.2,
    lossGrams: 8.9,
    lossPercent: 18.90,
    qualityTag: 'Under-dried',
    fragranceDosedMl: 12.5,
    energyUsedWh: 38.0,
    solarSharePct: 95.0,
    avgTemp: 56.4,
    operator: 'Lakshmi Devi',
    status: 'Warning Flagged'
  },
  {
    id: 'BATCH-2026-0927-07',
    timestamp: '2026-09-27 11:30',
    sticksCount: 50,
    packsCompleted: 10,
    beforeWeight: 92.8,
    afterWeight: 68.1,
    lossGrams: 24.7,
    lossPercent: 26.61,
    qualityTag: 'Over-dried',
    fragranceDosedMl: 25.0,
    energyUsedWh: 54.1,
    solarSharePct: 98.2,
    avgTemp: 73.5,
    operator: 'Meena Kumari',
    status: 'Warning Flagged'
  }
];

// 9. Initial Real-Time Alerts Feed
export const initialAlerts = [
  {
    id: 'ALT-109',
    timestamp: '2026-09-28 09:40:02',
    severity: 'critical', // critical | warning | info
    category: 'POWER_SYSTEM',
    title: 'Uneven Current Alert (6.9 A spike)',
    message: 'Current surge of 6.9A detected at min 40 (+56.8% over 4.4A baseline). Check heating coil pulsed relay or short condition.',
    faultCode: 'ERR-CURR-040',
    stage: 'Drying Phase',
    acknowledged: false,
    active: true
  },
  {
    id: 'ALT-108',
    timestamp: '2026-09-28 09:20:14',
    severity: 'info',
    category: 'PROCESS',
    title: 'Temperature Reached Optimal Range',
    message: 'Chamber temperature reached 60.0 °C. Stage 1 convection stabilized.',
    faultCode: 'INFO-TEMP-OK',
    stage: 'Drying Phase',
    acknowledged: true,
    active: false
  },
  {
    id: 'ALT-107',
    timestamp: '2026-09-28 09:00:00',
    severity: 'info',
    category: 'SYSTEM',
    title: '5-Stick Batch Initialization',
    message: 'Loaded batch BATCH-2026-0928-01. Tray pre-weight calibrated at 9.32g.',
    faultCode: 'INFO-BATCH-INIT',
    stage: 'Drying Phase',
    acknowledged: true,
    active: false
  }
];
