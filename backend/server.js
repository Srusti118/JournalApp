require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const { errorHandler } = require("./middleware/errorHandler");
const { validateEnv, config } = require("./config/constants");

// Validate environment
validateEnv();

const app = express();

// Trust proxy (for production behind reverse proxy)
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();