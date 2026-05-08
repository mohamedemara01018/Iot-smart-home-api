const mqtt = require('mqtt');
require('dotenv').config();

const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1883';

const mqttClient = mqtt.connect(MQTT_URL, {
  reconnectPeriod: 5000,
  connectTimeout: 30000
});

module.exports = mqttClient;
