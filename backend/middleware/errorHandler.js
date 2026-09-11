// Centralized error handling middleware

class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let code = err.code || "SERVER_ERROR";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    code = "VALIDATION_ERROR";
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 400;
    message = `${field} already exists`;
    code = "DUPLICATE_ERROR";
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    code = "CAST_ERROR";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    code = "INVALID_TOKEN";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    code = "TOKEN_EXPIRED";
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async handler wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, errorHandler, asyncHandler };