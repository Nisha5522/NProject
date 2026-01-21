const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Define associations
Store.hasMany(Rating, { foreignKey: "storeId", as: "ratings" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });

User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "userId", as: "user" });

Store.belongsTo(User, { foreignKey: "storeId", as: "owner" });
User.hasOne(Store, { foreignKey: "storeId", as: "ownedStore" });

module.exports = {
  User,
  Store,
  Rating,
};
