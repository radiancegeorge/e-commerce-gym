const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const orders = (sequelize, dataType) => {
  const orders = sequelize.define("orders", {
    orderId: {
      allowNull: false,
      type: dataType.UUID,
      defaultValue: dataType.UUIDV4,
    },
    status: {
      type: dataType.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    total: {
      allowNull: false,
      defaultValue: 0,
      type: dataType.DECIMAL(10, 2),
    },
  });

  orders.associate = (models) => {
    orders.belongsToMany(models.products, { through: models.orderProducts });
    orders.belongsTo(models.users);
    orders.belongsTo(models.deliveryAddress);
  };

  return orders;
};

module.exports = orders;
