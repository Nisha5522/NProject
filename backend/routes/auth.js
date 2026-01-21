const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { protect } = require("../middleware/auth");
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
} = require("../middleware/validation");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password will be hashed by hook)
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: "user",
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.email, "Testing password...");

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        storeId: user.storeId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        address: req.user.address,
        role: req.user.role,
        storeId: req.user.storeId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private
router.put(
  "/update-password",
  protect,
  updatePasswordValidation,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(req.user.id);

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      // Update password (will be hashed by hook)
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/auth/credentials
// @desc    Get all user credentials for login page (DEMO ONLY - NOT FOR PRODUCTION)
// @access  Public
router.get("/credentials", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "storeId", "plainPassword"],
      order: [
        ["role", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // ⚠️ WARNING: Exposing passwords is ONLY for demo/development
    // NEVER do this in production!
    const credentials = users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
      password: user.plainPassword || "Password123!", // Fallback for existing users
    }));

    res.json({
      success: true,
      credentials,
      warning: "⚠️ DEMO MODE: Passwords are visible for testing only!",
    });
  } catch (error) {
    console.error("Get credentials error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
