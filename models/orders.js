const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const orders = (sequelize, dataType) => {
  const orders = sequelize.define("orders", {
    status: {
      type: dataType.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  });

  orders.associate = (models) => {
    orders.belongsToMany(models.products, { through: "orderProducts" });
    orders.belongsTo(models.users);
    orders.belongsTo(models.deliveryAddress);
  };

  return orders;
};

module.exports = orders;
