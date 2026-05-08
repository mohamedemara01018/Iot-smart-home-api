const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const sensorRoutes = require("./routes/sensorRoutes");
const doorRoutes = require("./routes/doorRoutes");
const lightRoutes = require("./routes/lightRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ================= SWAGGER SPEC ================= */
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Home IoT Backend API",
      version: "1.0.0",
      description:
        "REST APIs for sensors, door control, light control, and face recognition logs.",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://iot-smart-home-api.vercel.app"
            : "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/*.js"],
});

/* ================= SWAGGER ROUTES ================= */
app.use("/api-docs", swaggerUi.setup(swaggerSpec));

app.get("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.json({
    message: "Smart Home IoT backend is running",
    docs: "/api-docs",
  });
});

/* ================= API ROUTES ================= */
app.use("/api", sensorRoutes);
app.use("/api", doorRoutes);
app.use("/api", lightRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* ================= VERCEL EXPORT ================= */
module.exports = app;

/* ================= LOCAL ONLY ================= */
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}