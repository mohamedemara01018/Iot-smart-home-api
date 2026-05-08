const express = require('express');
const {
  getDoor,
  openDoor,
  closeDoor,
  saveDoorLog
} = require('../controllers/doorController');

const router = express.Router();

/**
 * @swagger
 * /api/door:
 *   get:
 *     summary: Get the current door status.
 *     tags: [Door]
 *     responses:
 *       200:
 *         description: Current door status from Firebase.
 */
router.get('/door', getDoor);

/**
 * @swagger
 * /api/opendoor:
 *   post:
 *     summary: Open the door.
 *     tags: [Door]
 *     responses:
 *       200:
 *         description: Door open command published to MQTT and Firebase updated.
 */
router.post('/opendoor', openDoor);

/**
 * @swagger
 * /api/closedoor:
 *   post:
 *     summary: Close the door.
 *     tags: [Door]
 *     responses:
 *       200:
 *         description: Door close command published to MQTT and Firebase updated.
 */
router.post('/closedoor', closeDoor);

/**
 * @swagger
 * /api/savedoor:
 *   post:
 *     summary: Save a recognized person log from the face recognition system.
 *     tags: [Door]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed
 *               time:
 *                 type: string
 *                 example: 2026-05-07 10:30
 *     responses:
 *       201:
 *         description: Log saved to Firebase.
 *       400:
 *         description: Missing name.
 */
router.post('/savedoor', saveDoorLog);

module.exports = router;
