const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const cart = (sequelize, dataType) => {
  const cart = sequelize.define("cart", {});

  cart.associate = (models) => {
    cart.belongsToMany(models.products, { through: "cartProducts" });
    cart.belongsTo(models.users);
  };

  return cart;
};

module.exports = cart;
