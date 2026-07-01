require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const noteRoutes = require("./routes/note.routes");

// Debug: Check if env variable is loaded
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/notes", noteRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Journal API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
