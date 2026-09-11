// Environment configuration
const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB
  mongoUri: process.env.MONGODB_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: "HS256",

  // Token expiration
  accessTokenExpiry: "15m",
  refreshTokenExpiryDays: 7,
  csrfTokenExpiryDays: 7,

  // Cookie configuration
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  },

  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
};

// Validate required environment variables
function validateEnv() {
  const required = ["MONGODB_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && config.nodeEnv === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return config;
}

module.exports = { config, validateEnv };