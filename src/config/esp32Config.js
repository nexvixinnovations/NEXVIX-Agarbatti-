/**
 * ==============================================================================
 * NEXVIX ESP32 HARDWARE INTEGRATION & TELEMETRY CONFIGURATION
 * ==============================================================================
 * This configuration file defines the hardware communication interfaces for
 * connecting physical ESP32 / ESP8266 / Raspberry Pi Pico W microcontrollers
 * on the NEXVIX Smart Solar Agarbatti Machine.
 * 
 * Supported Protocols:
 * 1. WebSocket (Real-time bi-directional, recommended for <50ms latency)
 * 2. MQTT (Standard IoT Pub/Sub via broker such as EMQX, Mosquitto, HiveMQ)
 * 3. REST API (Polling & HTTP POST webhook)
 * ==============================================================================
 */

export const ESP32_CONFIG = {
  // Active Connection Mode: 'SIMULATION' | 'WEBSOCKET' | 'MQTT' | 'REST'
  DEFAULT_CONNECTION_MODE: 'SIMULATION',

  // Device Identifiers
  DEVICE_ID: 'NEXVIX-SOLAR-09',
  FIRMWARE_REVISION: 'v2.4.1-esp32-s3',
  HEARTBEAT_INTERVAL_MS: 2000,

  // 1. WebSocket Configuration
  WEBSOCKET: {
    ENABLED: true,
    URL: 'ws://192.168.4.1:81/ws', // Default ESP32 SoftAP or Local IP
    FALLBACK_URL: 'wss://iot.nexvix.internal/stream',
    RECONNECT_DELAY_MS: 3000,
    MAX_RETRIES: 5,
  },

  // 2. MQTT Protocol Configuration
  MQTT: {
    ENABLED: false,
    BROKER_URL: 'wss://broker.emqx.io:8084/mqtt', // or broker.hivemq.com:8884
    CLIENT_ID_PREFIX: 'NEXVIX_DASHBOARD_',
    USERNAME: 'nexvix_operator',
    PASSWORD: 'solar_secure_token',
    TOPICS: {
      TELEMETRY: 'nexvix/machine/telemetry',       // ESP32 -> Web
      ALERTS: 'nexvix/machine/alerts',             // ESP32 -> Web
      COMMANDS: 'nexvix/machine/control',          // Web -> ESP32
      CALIBRATION: 'nexvix/machine/calibration',   // Web -> ESP32
      OTA_UPDATE: 'nexvix/machine/firmware',       // Web -> ESP32
    },
    QOS: 1,
  },

  // 3. REST API Endpoints
  REST: {
    BASE_URL: 'http://192.168.4.1/api/v1',
    ENDPOINTS: {
      LIVE_TELEMETRY: '/telemetry/live',
      POST_CALIBRATION: '/sensors/calibrate',
      TRIGGER_ACTUATOR: '/actuator/control',
      GET_BATCH_STATS: '/batch/current',
      SET_THRESHOLDS: '/config/thresholds',
      SYSTEM_REBOOT: '/system/restart',
    },
    POLLING_INTERVAL_MS: 2000,
    TIMEOUT_MS: 5000,
  },

  // 4. Expected Telemetry JSON Packet Schema from ESP32
  TELEMETRY_PACKET_SCHEMA: {
    timestamp: 'ISO8601 String or Epoch Milliseconds',
    cycle_time_sec: 'Integer (e.g. 2400 for min 40)',
    stage: 'String: "drying" | "fragrance" | "counting" | "packaging"',
    sensors: {
      temp_chamber_c: 'Float (e.g. 67.0)',
      humidity_pct: 'Float (e.g. 26.0)',
      loadcell_tray_g: 'Float (e.g. 7.85)',
      battery_voltage_v: 'Float (e.g. 12.0)',
      battery_current_a: 'Float (e.g. 6.9)',
      solar_voltage_v: 'Float (e.g. 18.4)',
      solar_current_a: 'Float (e.g. 3.5)',
      fragrance_tank_ml: 'Float (e.g. 997.5)',
      stick_counter_ir: 'Integer (e.g. 5)',
      pack_counter: 'Integer (e.g. 1)'
    },
    actuators: {
      heater_pwm: 'Integer 0-255 (or "ON" | "Pulsing" | "OFF")',
      fan_speed: '"Low" | "Medium" | "High" | "OFF"',
      fragrance_solenoid: 'Boolean',
      conveyor_stepper: 'Boolean'
    },
    system_status: {
      power_source: '"Solar" | "Battery" | "Hybrid"',
      alert_active: 'Boolean',
      alert_code: 'String (e.g. "ERR-CURR-040")'
    }
  },

  // 5. ESP32 Arduino C++ Code Reference Snippet
  ARDUINO_SNIPPET: `
/*
 * NEXVIX Agarbatti IoT Firmware - ESP32 Telemetry Sender Example
 * Compatible with ESP32-S3 / Arduino Core
 */
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

WebSocketsServer webSocket = WebSocketsServer(81);

void sendTelemetry() {
  StaticJsonDocument<512> doc;
  doc["timestamp"] = millis();
  doc["stage"] = "drying";
  
  JsonObject sensors = doc.createNestedObject("sensors");
  sensors["temp_chamber_c"] = readDHT22Temp();
  sensors["humidity_pct"] = readDHT22Hum();
  sensors["loadcell_tray_g"] = readHX711Weight();
  sensors["battery_voltage_v"] = readINA219Voltage();
  sensors["battery_current_a"] = readINA219Current();
  sensors["fragrance_tank_ml"] = readUltrasonicTank();
  sensors["stick_counter_ir"] = stickCount;

  String output;
  serializeJson(doc, output);
  webSocket.broadcastTXT(output);
}
`
};

export default ESP32_CONFIG;
