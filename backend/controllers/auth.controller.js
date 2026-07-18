const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Token configuration
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// Cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 7 days in ms
  path: "/",
});

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  });

  return token;
};

// Generate CSRF Token
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    const csrfToken = generateCsrfToken();

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, getCookieOptions());
    
    // Set CSRF token in a readable cookie (not httpOnly, so JS can read it)
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
      csrfToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    const csrfToken = generateCsrfToken();

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, getCookieOptions());
    
    // Set CSRF token in a readable cookie
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
      csrfToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      res.clearCookie("refreshToken");
      res.clearCookie("csrfToken");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    const accessToken = generateAccessToken(storedToken.user);
    const newRefreshToken = await generateRefreshToken(storedToken.user);
    const csrfToken = generateCsrfToken();

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, getCookieOptions());
    
    // Set new CSRF token cookie
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      accessToken,
      csrfToken,
    });
  } catch (error) {
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear cookies
    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("csrfToken", { path: "/" });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
