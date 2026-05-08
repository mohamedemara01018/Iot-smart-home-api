const database = require('../config/firebase');

async function setSensorValue(sensorName, value) {
  await database.ref(`sensors/${sensorName}`).set(value);
  return value;
}

async function getSensorValue(sensorName) {
  const snapshot = await database.ref(`sensors/${sensorName}`).once('value');
  return snapshot.val();
}

async function setDoorStatus(status) {
  await database.ref('door/status').set(status);
  return status;
}

async function getDoorStatus() {
  const snapshot = await database.ref('door/status').once('value');
  return snapshot.val();
}

async function setLightStatus(status) {
  await database.ref('light/status').set(status);
  return status;
}

async function getLightStatus() {
  const snapshot = await database.ref('light/status').once('value');
  return snapshot.val();
}

async function saveRecognizedPersonLog(log) {
  const ref = database.ref('logs').push();
  const savedLog = {
    name: log.name,
    time: log.time || new Date().toISOString()
  };

  await ref.set(savedLog);
  await setDoorStatus(savedLog.name == 'unknown' ? 'CLOSED' : 'OPEN')

  return {
    id: ref.key,
    ...savedLog
  };
}


async function getLogsFirebase() {
  const snapshot = await database.ref(`logs`).once('value');
  return snapshot.val();
}


module.exports = {
  setSensorValue,
  getSensorValue,
  setDoorStatus,
  getDoorStatus,
  setLightStatus,
  getLightStatus,
  saveRecognizedPersonLog,
  getLogsFirebase
};
