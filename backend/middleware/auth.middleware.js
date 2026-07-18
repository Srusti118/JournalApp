const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Verify CSRF token
const verifyCsrf = (req, res, next) => {
  const csrfTokenFromCookie = req.cookies?.csrfToken;
  const csrfTokenFromHeader = req.headers["x-csrf-token"];

  if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
    return res.status(403).json({ message: "CSRF token missing" });
  }

  if (csrfTokenFromCookie !== csrfTokenFromHeader) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};

// Verify access token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key"
      );

      if (decoded.type === "refresh") {
        return res.status(401).json({ 
          message: "Use access token for authentication" 
        });
      }

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Access token expired",
          code: "TOKEN_EXPIRED"
        });
      }
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Combined middleware: CSRF + Auth
const protectWithCsrf = [verifyCsrf, protect];

module.exports = { protect, verifyCsrf, protectWithCsrf };
