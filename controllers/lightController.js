const {
  getLightStatus,
  setLightStatus
} = require('../services/firebaseService');
const { publishCommand } = require('../services/mqttService');

async function getLight(req, res, next) {
  try {
    const status = await getLightStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    next(error);
  }
}

async function updateLight(req, res, next) {
  try {
    const { status } = req.body;
    const normalizedStatus = String(status || '').toUpperCase();

    if (!['ON', 'OFF'].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: 'status must be ON or OFF'
      });
    }

    await publishCommand('home/light', normalizedStatus);
    await setLightStatus(normalizedStatus);

    res.json({
      success: true,
      message: `Light turned ${normalizedStatus}`,
      status: normalizedStatus
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLight,
  updateLight
};
