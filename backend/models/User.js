const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [20, 60],
          msg: "Name must be between 20 and 60 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "Password must be between 8 and 16 characters",
        },
        isStrongPassword(value) {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          if (!hasUpperCase || !hasSpecialChar) {
            throw new Error(
              "Password must contain at least one uppercase letter and one special character",
            );
          }
        },
      },
    },
    plainPassword: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "DEMO ONLY: Plain text password for display purposes",
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: {
          args: [1, 400],
          msg: "Address must be max 400 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "owner"),
      allowNull: false,
      defaultValue: "user",
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.plainPassword = user.password; // Store plain password for demo
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.plainPassword = user.password; // Store plain password for demo
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
