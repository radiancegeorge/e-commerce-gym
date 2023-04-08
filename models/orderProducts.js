const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const orderProducts = (sequelize, dataType) => {
  const orderProducts = sequelize.define("orderProducts", {
    quantity: {
      type: dataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total: {
      type: dataType.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  orderProducts.associate = (models) => {
    orderProducts.belongsTo(models.colors);
    orderProducts.belongsTo(models.sizes);
  };
  return orderProducts;
};

module.exports = orderProducts;
