/**
 * Multi-language localization dictionary
 * Languages: English (en), Tamil (ta), Hindi (hi)
 */

export const translations = {
  en: {
    dashboard: 'Dashboard',
    dryingMonitor: 'Drying Monitor',
    powerBattery: 'Power & Battery',
    weightAnalysis: 'Weight Analysis',
    fragranceModule: 'Fragrance Module',
    batchesReports: 'Batches & Reports',
    alertsCenter: 'Alerts & Health',
    settings: 'Settings & Hardware',
    tagline: 'Smart Solar Agarbatti Processing',
    subTagline: 'Empowering rural women artisans through solar-powered smart manufacturing.',
    
    // Status
    liveOnline: 'SYSTEM ONLINE',
    solarActive: 'SOLAR POWERED',
    properlyDried: 'Properly Dried',
    underDried: 'Under-dried',
    overDried: 'Over-dried',
    alertActive: 'ALERT DETECTED',
    
    // Telemetry labels
    chamberTemp: 'Chamber Temperature',
    targetTemp: 'Target 60 - 70 °C',
    humidity: 'Chamber Humidity',
    batteryCurrent: 'Battery Current Draw',
    batteryVoltage: 'Battery Voltage',
    powerDraw: 'Total Power Draw',
    batterySoc: 'Battery Charge (SOC)',
    solarInput: 'Solar Panel Input',
    fragranceTank: 'Fragrance Tank (1 L)',
    stickWeightLoss: 'Stick Weight & Loss',
    stickCount: 'Sticks Counted',
    packsCompleted: 'Packs Completed',
    
    // Stages
    dryingStage: 'Solar Drying',
    fragranceStage: 'Fragrance Spray',
    countingStage: 'Optical Counting',
    packagingStage: 'Auto Packaging',
    
    // Actions
    replayCycle: 'Replay 60m Cycle',
    triggerAlert: 'Simulate Alert',
    exportCsv: 'Export CSV',
    exportPdf: 'Print Report',
    addNewStick: 'Record Stick Weight',
    refillTank: 'Log Refill',
    resetDemo: 'Reset Demo',
    
    // Details
    heaterStatus: 'Heater Status',
    fanSpeed: 'Exhaust Fan Speed',
    solarShare: 'Solar Coverage',
    estimatedRuntime: 'Est. Battery Runtime',
    totalEnergy: 'Cycle Energy',
    trayWeight: 'Tray Weight',
  },
  
  ta: {
    dashboard: 'முகப்பு பலகை',
    dryingMonitor: 'உலர்த்தும் கண்காணிப்பு',
    powerBattery: 'மின்சாரம் & பேட்டரி',
    weightAnalysis: 'எடை பகுப்பாய்வு',
    fragranceModule: 'நறுமண தெளிப்பு நிலை',
    batchesReports: 'தொகுதி அறிக்கைகள்',
    alertsCenter: 'எச்சரிக்கைகள் & நிலை',
    settings: 'அமைப்புகள் & ESP32',
    tagline: 'சூரிய சக்தி ஸ்மார்ட் ஊதுபத்தி இயந்திரம்',
    subTagline: 'சூரிய சக்தி ஸ்மார்ட் உற்பத்தி மூலம் கிராமப்புற பெண் கைவினைஞர்களை மேம்படுத்துதல்.',
    
    // Status
    liveOnline: 'இயந்திரம் இயங்குகிறது',
    solarActive: 'சூரிய மின்சக்தி',
    properlyDried: 'சரியாக உலர்ந்தது',
    underDried: 'குறைவாக உலர்ந்தது',
    overDried: 'அதிகமாக உலர்ந்தது',
    alertActive: 'எச்சரிக்கை உள்ளது',
    
    // Telemetry labels
    chamberTemp: 'அறை வெப்பநிலை',
    targetTemp: 'இலக்கு 60 - 70 °C',
    humidity: 'காற்றின் ஈரப்பதம்',
    batteryCurrent: 'மின்கல மின்னோட்டம் (Current)',
    batteryVoltage: 'மின்கல மின்னழுத்தம் (Voltage)',
    powerDraw: 'மொத்த மின் நுகர்வு',
    batterySoc: 'பேட்டரி அளவு (SOC)',
    solarInput: 'சூரிய ஒளி உள்ளீடு',
    fragranceTank: 'நறுமண தொட்டி (1 லிட்டர்)',
    stickWeightLoss: 'குச்சியின் எடை இழப்பு',
    stickCount: 'எண்ணப்பட்ட குச்சிகள்',
    packsCompleted: 'முடிக்கப்பட்ட பாக்கெட்டுகள்',
    
    // Stages
    dryingStage: 'சூரிய உலர்த்தல்',
    fragranceStage: 'நறுமணம் தெளித்தல்',
    countingStage: 'தானியங்கி எண்ணுதல்',
    packagingStage: 'பாக்கேஜிங்',
    
    // Actions
    replayCycle: '60 நிமிடம் மறுஇயக்கம்',
    triggerAlert: 'எச்சரிக்கை சோதனை',
    exportCsv: 'CSV பதிவிறக்கம்',
    exportPdf: 'அறிக்கை அச்சிடு',
    addNewStick: 'குச்சி எடை பதிவு செய்',
    refillTank: 'நறுமணம் நிரப்பு',
    resetDemo: 'மீட்டமைக்க',
    
    // Details
    heaterStatus: 'ஹீட்டர் நிலை',
    fanSpeed: 'விசிறி வேகம்',
    solarShare: 'சூரிய சக்தி பங்கு',
    estimatedRuntime: 'மதிப்பிடப்பட்ட நேரம்',
    totalEnergy: 'சுழற்சி ஆற்றல்',
    trayWeight: 'தட்டு எடை',
  },
  
  hi: {
    dashboard: 'डैशबोर्ड',
    dryingMonitor: 'ड्राइंग मॉनिटर',
    powerBattery: 'पावर और बैटरी',
    weightAnalysis: 'वज़न विश्लेषण',
    fragranceModule: 'सुगंध स्प्रे मॉड्यूल',
    batchesReports: 'बैच और रिपोर्ट्स',
    alertsCenter: 'अलर्ट और स्वास्थ्य',
    settings: 'सेटिंग्स और हार्डवेयर',
    tagline: 'स्मार्ट सौर अगरबत्ती प्रसंस्करण प्रणाली',
    subTagline: 'सौर-संचालित स्मार्ट निर्माण के माध्यम से ग्रामीण महिला कारीगरों का सशक्तिकरण।',
    
    // Status
    liveOnline: 'सिस्टम ऑनलाइन',
    solarActive: 'सौर ऊर्जा संचालित',
    properlyDried: 'उचित रूप से सुखाया गया',
    underDried: 'कम सूखा हुआ',
    overDried: 'अति-सूखा हुआ',
    alertActive: 'अलर्ट सक्रिय',
    
    // Telemetry labels
    chamberTemp: 'कक्ष का तापमान',
    targetTemp: 'लक्ष्य 60 - 70 °C',
    humidity: 'कक्ष की आर्द्रता',
    batteryCurrent: 'बैटरी करंट ड्रा',
    batteryVoltage: 'बैटरी वोल्टेज',
    powerDraw: 'कुल बिजली खपत',
    batterySoc: 'बैटरी चार्ज (SOC)',
    solarInput: 'सोलर पैनल इनपुट',
    fragranceTank: 'सुगंध टैंक (1 लीटर)',
    stickWeightLoss: 'अगरबत्ती वज़न और कमी',
    stickCount: 'गिनी गई अगरबत्तियां',
    packsCompleted: 'पूर्ण किए गए पैकेट',
    
    // Stages
    dryingStage: 'सौर सुखाना',
    fragranceStage: 'सुगंध स्प्रे',
    countingStage: 'ऑप्टिकल गिनती',
    packagingStage: 'स्वचालित पैकेजिंग',
    
    // Actions
    replayCycle: '60 मिनट चक्र रिप्ले',
    triggerAlert: 'अलर्ट सिमुलेट करें',
    exportCsv: 'CSV डाउनलोड करें',
    exportPdf: 'प्रिंट रिपोर्ट',
    addNewStick: 'नया वज़न दर्ज करें',
    refillTank: 'रीफिल लॉग करें',
    resetDemo: 'रीसेट डेमो',
    
    // Details
    heaterStatus: 'हीटर की स्थिति',
    fanSpeed: 'पंखा गति',
    solarShare: 'सौर ऊर्जा कवरेज',
    estimatedRuntime: 'अनुमानित बैटरी समय',
    totalEnergy: 'चक्र ऊर्जा',
    trayWeight: 'ट्रे वज़न',
  }
};
