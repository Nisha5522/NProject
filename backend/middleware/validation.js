const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  body("address")
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage("Address must be max 400 characters"),
  validate,
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  validate,
];

const storeValidation = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 60 })
    .withMessage("Store name must be between 3 and 60 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("address")
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage("Address must be max 400 characters"),
  validate,
];

const ratingValidation = [
  body("storeId")
    .notEmpty()
    .withMessage("Store ID is required")
    .isUUID()
    .withMessage("Invalid store ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  storeValidation,
  ratingValidation,
};
