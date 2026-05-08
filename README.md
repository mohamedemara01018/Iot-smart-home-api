# Smart Home IoT Backend

Complete Node.js backend for a Smart Home IoT system using Express.js, MQTT, and Firebase Realtime Database.

## Architecture

- Frontend dashboard calls REST APIs from this backend.
- ESP32 sensors publish MQTT messages to Mosquitto.
- Backend subscribes to MQTT sensor topics and writes values to Firebase.
- Computer Vision face recognition system calls backend APIs to open the door and save recognized person logs.
- Backend publishes MQTT commands to actuators like the door motor and light.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env`:

```env
PORT=8000
MQTT_URL=mqtt://localhost:1883
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY=C:\path\to\serviceAccountKey.json
```

You can also use `FIREBASE_SERVICE_ACCOUNT_BASE64` instead of a file path for deployments.

3. Start Mosquitto locally on port `1883`.

4. Run the backend:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Documentation

After starting the server, open:

```text
http://localhost:8000/api-docs
```

## MQTT Topics

Subscribed sensor topics:

- `home/temp`
- `home/humidity`
- `home/gas`
- `home/flame`

Published actuator topics:

- `home/door`
- `home/light`

## REST APIs

- `GET /api/temp`
- `GET /api/humidity`
- `GET /api/gas`
- `GET /api/flame`
- `GET /api/door`
- `GET /api/light`
- `POST /api/opendoor`
- `POST /api/closedoor`
- `POST /api/light`
- `POST /api/savedoor`

Example `POST /api/light` body:

```json
{
  "status": "ON"
}
```

Example `POST /api/savedoor` body:

```json
{
  "name": "Ahmed",
  "time": "2026-05-07 10:30"
}
```

## Firebase Data Shape

```json
{
  "sensors": {
    "temp": 30,
    "humidity": 50,
    "gas": 120,
    "flame": false
  },
  "door": {
    "status": "OPEN"
  },
  "light": {
    "status": "ON"
  },
  "logs": {
    "firebaseGeneratedId": {
      "name": "Ahmed",
      "time": "2026-05-07 10:30"
    }
  }
}
```
