import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  Cpu, 
  X, 
  CheckCircle2, 
  Wifi, 
  Radio, 
  Terminal, 
  Layers, 
  Copy, 
  Check, 
  Sparkles,
  Server,
  Zap,
  RefreshCw
} from 'lucide-react';
import { ESP32_CONFIG } from '../config/esp32Config';

export const Esp32HardwareModal = ({ isOpen, onClose }) => {
  const { hardwareConfig, setHardwareConfig, liveTelemetry } = useMachine();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'endpoints' | 'code' | 'packets'

  if (!isOpen) return null;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(ESP32_CONFIG.ARDUINO_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleLivePacket = JSON.stringify({
    device_id: ESP32_CONFIG.DEVICE_ID,
    timestamp: new Date().toISOString(),
    cycle_min: liveTelemetry.cycleMinute,
    temp_c: liveTelemetry.chamberTemp,
    humidity_pct: liveTelemetry.humidity,
    tray_weight_g: liveTelemetry.trayWeight,
    battery_v: liveTelemetry.batteryVoltage,
    battery_a: liveTelemetry.batteryCurrent,
    solar_w: liveTelemetry.solarP,
    fragrance_ml: liveTelemetry.fragranceRemainingMl || 997.5,
    heater_state: liveTelemetry.heater,
    fan_state: liveTelemetry.fan
  }, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">ESP32 IoT Hardware Gateway</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {hardwareConfig.isConnected ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Firmware: {ESP32_CONFIG.FIRMWARE_REVISION} • SoftAP / LAN Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/30 text-xs font-semibold space-x-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'status' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Connection & Ping</span>
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'endpoints' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>MQTT / WebSocket Config</span>
          </button>
          <button
            onClick={() => setActiveTab('packets')}
            className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'packets' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Packet Stream</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'code' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>C++ Arduino Code</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Active Mode</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">{hardwareConfig.protocol}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Live 2-second simulation & replay</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Heartbeat Latency</span>
                  <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">{hardwareConfig.lastPingMs} ms</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Jitter ±3ms (Ultra-low latency)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Packets Received</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5 block">{hardwareConfig.packetsReceived} pkts</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">0 CRC Errors</span>
                </div>
              </div>

              {/* Protocol Selector */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Switch Hardware Protocol</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['SIMULATION', 'WEBSOCKET', 'MQTT', 'REST'].map((proto) => (
                    <button
                      key={proto}
                      onClick={() => setHardwareConfig(prev => ({ ...prev, protocol: proto }))}
                      className={`p-2.5 rounded-xl border text-left font-mono font-bold transition ${
                        hardwareConfig.protocol === proto 
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs">{proto}</div>
                      <div className="text-[9px] font-normal text-slate-400 mt-0.5">
                        {proto === 'WEBSOCKET' ? 'ws://192.168.4.1' : proto === 'MQTT' ? 'EMQX Broker' : proto === 'REST' ? 'HTTP Polling' : 'Virtual Loop'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pinout Reference */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-slate-200 text-xs mb-2">ESP32 Pin Allocation Map</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-amber-400 font-bold">GPIO 4 / 5</div>
                    <div className="text-slate-400 text-[10px]">INA219 (I2C Power)</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-emerald-400 font-bold">GPIO 18 / 19</div>
                    <div className="text-slate-400 text-[10px]">HX711 (Tray Load Cell)</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-cyan-400 font-bold">GPIO 23</div>
                    <div className="text-slate-400 text-[10px]">DHT22 Temp & Humidity</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-purple-400 font-bold">GPIO 26 / 27</div>
                    <div className="text-slate-400 text-[10px]">Spray Solenoid & Relay</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">WebSocket URL</span>
                <code className="text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded block select-all">
                  {ESP32_CONFIG.WEBSOCKET.URL}
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">MQTT Broker & Telemetry Topic</span>
                <code className="text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded block select-all mb-1">
                  {ESP32_CONFIG.MQTT.BROKER_URL}
                </code>
                <code className="text-amber-300 bg-slate-900 px-2.5 py-1 rounded text-[11px] block select-all">
                  Topic: {ESP32_CONFIG.MQTT.TOPICS.TELEMETRY}
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">REST API Polling URL</span>
                <code className="text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded block select-all">
                  {ESP32_CONFIG.REST.BASE_URL}{ESP32_CONFIG.REST.ENDPOINTS.LIVE_TELEMETRY}
                </code>
              </div>
            </div>
          )}

          {activeTab === 'packets' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 relative">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2 text-[10px]">
                <span>STREAM: ESP32-S3 -&gt; DASHBOARD (2000ms TICK)</span>
                <span className="animate-pulse text-emerald-400">● LIVE</span>
              </div>
              <pre className="overflow-x-auto text-emerald-300 leading-relaxed max-h-64">
                {sampleLivePacket}
              </pre>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="relative">
              <button
                onClick={handleCopySnippet}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 font-mono text-xs z-10 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-72">
                {ESP32_CONFIG.ARDUINO_SNIPPET}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Config location: <code className="text-emerald-400">/src/config/esp32Config.js</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Gateway
          </button>
        </div>

      </div>
    </div>
  );
};
