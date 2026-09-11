const { body, param, validationResult } = require("express-validator");

// Validate request and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// Note validations
const noteValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be 1-100 characters"),
  body("body")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Body must be at least 10 characters"),
  validate,
];

const paramValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid note ID"),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  noteValidation,
  paramValidation,
};