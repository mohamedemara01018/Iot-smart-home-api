const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const sensorRoutes = require('./routes/sensorRoutes');
const doorRoutes = require('./routes/doorRoutes');
const lightRoutes = require('./routes/lightRoutes');
const { connectMqtt } = require('./services/mqttService');

const app = express();
const PORT = process.env.PORT || 8000;

// Basic production-friendly middleware for JSON APIs.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Home IoT Backend API',
      version: '1.0.0',
      description: 'REST APIs for sensors, door control, light control, and face recognition logs.'
    },
    servers: [
      {
        url: `https://iot-smart-home-api.vercel.app`,
        description: 'Local development server'
      }
    ]
  },
  apis: ['./routes/*.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Home IoT backend is running',
    docs: '/api-docs'
  });
});

app.use('/api', sensorRoutes);
app.use('/api', doorRoutes);
app.use('/api', lightRoutes);

// Handle unknown routes with a clear JSON response.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central error handler. Controllers call next(error) so responses stay consistent.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});


app.use("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);

  // MQTT is started after Express so APIs are available even if the broker is down.
  connectMqtt();
});
