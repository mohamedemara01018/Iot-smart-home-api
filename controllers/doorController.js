const {
  getDoorStatus,
  setDoorStatus,
  saveRecognizedPersonLog,
  getLogsFirebase
} = require('../services/firebaseService');
const { publishCommand } = require('../services/mqttService');

async function getDoor(req, res, next) {
  try {
    const status = await getDoorStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    next(error);
  }
}

async function openDoor(req, res, next) {
  try {
    await publishCommand('home/door', 'OPEN DOOR');
    await setDoorStatus('OPEN');

    res.json({
      success: true,
      message: 'Door opened',
      status: 'OPEN'
    });
  } catch (error) {
    next(error);
  }
}

async function closeDoor(req, res, next) {
  try {
    await publishCommand('home/door', 'CLOSE DOOR');
    await setDoorStatus('CLOSED');

    res.json({
      success: true,
      message: 'Door closed',
      status: 'CLOSED'
    });
  } catch (error) {
    next(error);
  }
}

async function saveDoorLog(req, res, next) {
  try {
    const { name, time } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'name is required'
      });
    }

    const log = await saveRecognizedPersonLog({ name, time });

    res.status(201).json({
      success: true,
      message: 'Recognized person log saved',
      log
    });
  } catch (error) {
    next(error);
  }
}


async function getLogs(req, res, next) {
  try {

    const logs = await getLogsFirebase();

    res.status(201).json({
      success: true,
      logs
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getDoor,
  openDoor,
  closeDoor,
  saveDoorLog,
  getLogs
};
