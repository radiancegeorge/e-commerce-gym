const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const wishlist = (sequelize, dataType) => {
  const wishlist = sequelize.define("wishlist", {});

  wishlist.associate = (models) => {
    wishlist.belongsToMany(models.products, { through: "wishlistProducts" });
    wishlist.belongsTo(models.users);
  };

  return wishlist;
};

module.exports = wishlist;
