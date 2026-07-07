const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Token configuration
const ACCESS_TOKEN_EXPIRY = "15m";  // Short-lived
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Long-lived (in days)

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,      // JavaScript cannot access
  secure: process.env.NODE_ENV === "production",  // HTTPS only in production
  sameSite: "strict",  // CSRF protection
  maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
};

// Generate Access Token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = async (userId) => {
  const token = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key",
    { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` }
  );

  // Calculate expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  // Save to database
  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  });

  return token;
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    // Send access token in response body (NOT in localStorage, keep in memory)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    // Send access token in response body
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Check if token exists in database
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      res.clearCookie("refreshToken");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Verify token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key"
    );

    // Delete old refresh token (rotation)
    await RefreshToken.deleteOne({ token: refreshToken });

    // Generate new tokens
    const accessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = await generateRefreshToken(decoded.userId);

    // Set new refresh token as httpOnly cookie
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

    res.json({ accessToken });
  } catch (error) {
    res.clearCookie("refreshToken");
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Logout - invalidate refresh token
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear the cookie
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
