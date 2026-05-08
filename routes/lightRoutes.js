const express = require('express');
const {
  getLight,
  updateLight
} = require('../controllers/lightController');

const router = express.Router();

/**
 * @swagger
 * /api/light:
 *   get:
 *     summary: Get the current light status.
 *     tags: [Light]
 *     responses:
 *       200:
 *         description: Current light status from Firebase.
 */
router.get('/light', getLight);

/**
 * @swagger
 * /api/light:
 *   post:
 *     summary: Turn the light ON or OFF.
 *     tags: [Light]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ON, OFF]
 *                 example: ON
 *     responses:
 *       200:
 *         description: Light command published to MQTT and Firebase updated.
 *       400:
 *         description: Invalid status.
 */
router.post('/light', updateLight);

module.exports = router;
