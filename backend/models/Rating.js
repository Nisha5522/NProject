const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "stores",
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
  },
  {
    tableName: "ratings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "storeId"],
      },
    ],
  },
);

module.exports = Rating;
