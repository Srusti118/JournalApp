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
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  },

  // Swagger
  enableSwagger: process.env.ENABLE_SWAGGER === 'true' || (process.env.NODE_ENV || 'development') !== 'production',

  // CORS
  corsOrigins: Array.from(
    new Set([
      ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      `http://localhost:${parseInt(process.env.PORT, 10) || 5000}`,
    ].filter(Boolean))
  ),

  // Client URL (Frontend)
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback',
  },

  // Web Push VAPID
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    mailto: process.env.VAPID_MAILTO || 'mailto:admin@sanctuary.app',
  },
}

// Validate required environment variables
function validateEnv() {
  const required = ["MONGODB_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && config.nodeEnv === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return config;
}

export { config, validateEnv }