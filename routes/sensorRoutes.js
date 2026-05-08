const express = require('express');
const {
  getTemperature,
  getHumidity,
  getGas,
  getFlame
} = require('../controllers/sensorController');

const router = express.Router();

/**
 * @swagger
 * /api/temp:
 *   get:
 *     summary: Get the latest temperature value.
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Latest temperature value from Firebase.
 */
router.get('/temp', getTemperature);

/**
 * @swagger
 * /api/humidity:
 *   get:
 *     summary: Get the latest humidity value.
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Latest humidity value from Firebase.
 */
router.get('/humidity', getHumidity);

/**
 * @swagger
 * /api/gas:
 *   get:
 *     summary: Get the latest gas sensor value.
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Latest gas value from Firebase.
 */
router.get('/gas', getGas);

/**
 * @swagger
 * /api/flame:
 *   get:
 *     summary: Get the latest flame sensor value.
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Latest flame value from Firebase.
 */
router.get('/flame', getFlame);

module.exports = router;
