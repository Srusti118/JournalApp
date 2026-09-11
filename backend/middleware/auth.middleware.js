const { verifyAccessToken } = require("../services/token.service");
const User = require("../models/user.model");
const { AppError } = require("./errorHandler");

// CSRF protection middleware
const verifyCsrf = (req, res, next) => {
  const csrfTokenFromCookie = req.cookies?.csrfToken;
  const csrfTokenFromHeader = req.headers["x-csrf-token"];

  if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
    return next(new AppError("CSRF token missing", 403, "CSRF_MISSING"));
  }

  if (csrfTokenFromCookie !== csrfTokenFromHeader) {
    return next(new AppError("Invalid CSRF token", 403, "CSRF_INVALID"));
  }

  next();
};

// JWT authentication middleware
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("No token provided", 401, "NO_TOKEN"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 401, "USER_NOT_FOUND"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401, "TOKEN_EXPIRED"));
    }
    return next(new AppError("Invalid token", 401, "INVALID_TOKEN"));
  }
};

// Combined middleware for protected routes with CSRF
const protectWithCsrf = [verifyCsrf, protect];

module.exports = { protect, verifyCsrf, protectWithCsrf };