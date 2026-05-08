const { getSensorValue } = require('../services/firebaseService');

function buildSensorController(sensorName, responseKey) {
  return async (req, res, next) => {
    try {
      const value = await getSensorValue(sensorName);

      res.json({
        success: true,
        [responseKey]: value
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  getTemperature: buildSensorController('temp', 'temperature'),
  getHumidity: buildSensorController('humidity', 'humidity'),
  getGas: buildSensorController('gas', 'gas'),
  getFlame: buildSensorController('flame', 'flame')
};
