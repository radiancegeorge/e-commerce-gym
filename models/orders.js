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
    quantity: {
      type: dataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
