const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

// Routes
const sensorRoutes = require("./routes/sensorRoutes");
const doorRoutes = require("./routes/doorRoutes");
const lightRoutes = require("./routes/lightRoutes");

// MQTT
const { connectMqtt } = require("./services/mqttService");

const app = express();

// ================= ENV =================
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === "production";

// ================= MIDDLEWARE =================
app.use(helmet());
app.use(cors({
  origin: "*", // ممكن تقفلها بعدين على frontend domain
}));
app.use(express.json());
app.use(morgan(isProd ? "combined" : "dev"));

// ================= SWAGGER =================
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Home IoT Backend API",
      version: "1.0.0",
      description:
        "REST APIs for sensors, door control, light control, and logs.",
    },
    servers: [
      {
        url: process.env.BASE_URL || `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
});

// ================= SWAGGER JSON (IMPORTANT FOR DEPLOY) =================
app.get("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve);
app.get(["/api-docs", "/api-docs/"], swaggerUi.setup(swaggerSpec));

app.get("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});
// ================= SWAGGER UI =================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.json({
    message: "Smart Home IoT backend is running 🚀",
    docs: "/api-docs",
    swagger_json: "/api-docs-json",
  });
});

// ================= API ROUTES =================
app.use("/api", sensorRoutes);
app.use("/api", doorRoutes);
app.use("/api", lightRoutes);

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ================= MQTT (SAFE FOR PROD) =================
if (process.env.ENABLE_MQTT === "true") {
  connectMqtt();
}

// ================= VERCEL EXPORT =================
module.exports = app;

// ================= LOCAL SERVER ONLY =================
if (!isProd) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
  });
}