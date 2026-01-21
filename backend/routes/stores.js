const express = require("express");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Store, Rating, User } = require("../models");
const { protect, authorize } = require("../middleware/auth");
const { ratingValidation } = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all stores with optional filters
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const {
      name,
      address,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const allowedSortFields = ["name", "address", "averageRating", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const stores = await Store.findAll({
      where,
      order: [[sortField, order]],
      include:
        req.user.role === "user"
          ? [
              {
                model: Rating,
                as: "ratings",
                where: { userId: req.user.id },
                required: false,
                attributes: ["id", "rating"],
              },
            ]
          : [],
    });

    // Format response for users
    const storesData = stores.map((store) => {
      const storeData = {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        averageRating: parseFloat(store.averageRating) || 0,
        totalRatings: store.totalRatings,
      };

      if (
        req.user.role === "user" &&
        store.ratings &&
        store.ratings.length > 0
      ) {
        storeData.userRating = store.ratings[0].rating;
        storeData.userRatingId = store.ratings[0].id;
      }

      return storeData;
    });

    res.json({
      success: true,
      count: storesData.length,
      stores: storesData,
    });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/stores/:id
// @desc    Get store details
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: Rating,
          as: "ratings",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json({
      success: true,
      store,
    });
  } catch (error) {
    console.error("Get store error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/stores/rating
// @desc    Submit rating for a store
// @access  Private/User
router.post(
  "/rating",
  protect,
  authorize("user"),
  ratingValidation,
  async (req, res) => {
    try {
      const { storeId, rating } = req.body;

      // Check if store exists
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      // Check if user already rated this store
      const existingRating = await Rating.findOne({
        where: { userId: req.user.id, storeId },
      });

      if (existingRating) {
        return res
          .status(400)
          .json({
            message:
              "You have already rated this store. Use update endpoint to modify.",
          });
      }

      // Create rating
      const newRating = await Rating.create({
        userId: req.user.id,
        storeId,
        rating,
      });

      // Update store average rating
      await updateStoreRating(storeId);

      res.status(201).json({
        success: true,
        rating: newRating,
      });
    } catch (error) {
      console.error("Submit rating error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   PUT /api/stores/rating/:id
// @desc    Update rating
// @access  Private/User
router.put("/rating/:id", protect, authorize("user"), async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Find rating
    const existingRating = await Rating.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existingRating) {
      return res
        .status(404)
        .json({ message: "Rating not found or unauthorized" });
    }

    // Update rating
    existingRating.rating = rating;
    await existingRating.save();

    // Update store average rating
    await updateStoreRating(existingRating.storeId);

    res.json({
      success: true,
      rating: existingRating,
    });
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/stores/owner/ratings
// @desc    Get ratings for store owner's store
// @access  Private/Owner
router.get("/owner/ratings", protect, authorize("owner"), async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res
        .status(400)
        .json({ message: "No store associated with this account" });
    }

    const store = await Store.findByPk(req.user.storeId, {
      include: [
        {
          model: Rating,
          as: "ratings",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        averageRating: parseFloat(store.averageRating) || 0,
        totalRatings: store.totalRatings,
      },
      ratings: store.ratings,
    });
  } catch (error) {
    console.error("Get owner ratings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to update store rating
async function updateStoreRating(storeId) {
  const result = await Rating.findAll({
    where: { storeId },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      [sequelize.fn("COUNT", sequelize.col("id")), "totalRatings"],
    ],
    raw: true,
  });

  const avgRating = parseFloat(result[0].avgRating) || 0;
  const totalRatings = parseInt(result[0].totalRatings) || 0;

  await Store.update(
    {
      averageRating: avgRating.toFixed(2),
      totalRatings,
    },
    { where: { id: storeId } },
  );
}

module.exports = router;
