const express = require("express");
const { Op } = require("sequelize");
const { User, Store, Rating } = require("../models");
const { protect, authorize } = require("../middleware/auth");
const {
  registerValidation,
  storeValidation,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: { role: { [Op.ne]: "admin" } },
    });
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user (by admin)
// @access  Private/Admin
router.post(
  "/users",
  protect,
  authorize("admin"),
  registerValidation,
  async (req, res) => {
    try {
      const { name, email, password, address, role, storeId } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Validate role
      if (role && !["user", "admin", "owner"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        address,
        role: role || "user",
        storeId: storeId || null,
      });

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        storeId: user.storeId,
        createdAt: user.createdAt,
      };

      res.status(201).json({
        success: true,
        user: userResponse,
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/admin/users
// @desc    Get all users with filters and sorting
// @access  Private/Admin
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    // Build where clause
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    // Validate sort field
    const allowedSortFields = ["name", "email", "address", "role", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          as: "ownedStore",
          attributes: ["id", "name", "averageRating"],
        },
      ],
      order: [[sortField, order]],
    });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get user details
// @access  Private/Admin
router.get("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          as: "ownedStore",
          attributes: ["id", "name", "email", "address", "averageRating"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/stores
// @desc    Create new store
// @access  Private/Admin
router.post(
  "/stores",
  protect,
  authorize("admin"),
  storeValidation,
  async (req, res) => {
    try {
      const { name, email, address } = req.body;

      // Check if store exists
      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) {
        return res
          .status(400)
          .json({ message: "Store with this email already exists" });
      }

      const store = await Store.create({
        name,
        email,
        address,
      });

      res.status(201).json({
        success: true,
        store,
      });
    } catch (error) {
      console.error("Create store error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/admin/stores
// @desc    Get all stores with filters
// @access  Private/Admin
router.get("/stores", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const allowedSortFields = [
      "name",
      "email",
      "address",
      "averageRating",
      "createdAt",
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const stores = await Store.findAll({
      where,
      order: [[sortField, order]],
    });

    res.json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role, storeId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Validate role
    if (role && !["user", "admin", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (role) user.role = role;
    if (storeId !== undefined) user.storeId = storeId || null;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
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
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/stores/:id
// @desc    Update store
// @access  Private/Admin
router.put("/stores/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== store.email) {
      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update store fields
    if (name) store.name = name;
    if (email) store.email = email;
    if (address) store.address = address;

    await store.save();

    res.json({
      success: true,
      message: "Store updated successfully",
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: store.averageRating,
        totalRatings: store.totalRatings,
      },
    });
  } catch (error) {
    console.error("Update store error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
