const mqttClient = require('../config/mqtt');
const {
  setSensorValue
} = require('./firebaseService');

const sensorTopics = {
  'home/temp': 'temp',
  'home/humidity': 'humidity',
  'home/gas': 'gas',
  'home/flame': 'flame'
};

function parseSensorMessage(sensorName, message) {
  const rawValue = message.toString().trim();

  if (sensorName === 'flame') {
    return rawValue === 'true' || rawValue === '1' || rawValue.toUpperCase() === 'ON';
  }

  const numberValue = Number(rawValue);
  return Number.isNaN(numberValue) ? rawValue : numberValue;
}

function connectMqtt() {
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    Object.keys(sensorTopics).forEach((topic) => {
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err.message);
          return;
        }

        console.log(`Subscribed to MQTT topic: ${topic}`);
      });
    });
  });

  mqttClient.on('message', async (topic, message) => {
    const sensorName = sensorTopics[topic];

    if (!sensorName) {
      return;
    }

    try {
      const value = parseSensorMessage(sensorName, message);
      await setSensorValue(sensorName, value);
      console.log(`Firebase updated: sensors/${sensorName} = ${value}`);
    } catch (error) {
      console.error(`Failed to process MQTT message from ${topic}:`, error.message);
    }
  });

  mqttClient.on('error', (error) => {
    console.error('MQTT error:', error.message);
  });

  mqttClient.on('reconnect', () => {
    console.log('Reconnecting to MQTT broker...');
  });
}

function publishCommand(topic, command) {
  return new Promise((resolve, reject) => {
    if (!mqttClient.connected) {
      const error = new Error('MQTT broker is not connected');
      error.statusCode = 503;
      reject(error);
      return;
    }

    mqttClient.publish(topic, command, { qos: 1 }, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ topic, command });
    });
  });
}

module.exports = {
  connectMqtt,
  publishCommand
};
