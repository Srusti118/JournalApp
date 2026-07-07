require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const noteRoutes = require("./routes/note.routes");
const authRoutes = require("./routes/auth.routes");

// Debug: Check if env variable is loaded
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "⚠️ Not set (using default)");

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",  // Vite dev server
  "http://localhost:5174",
  "http://localhost:3000",
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Journal API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
