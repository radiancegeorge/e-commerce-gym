const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const deliveryAddress = (sequelize, dataType) => {
  const deliveryAddress = sequelize.define("deliveryAddress", {
    addressLine1: {
      type: dataType.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: dataType.STRING,
      allowNull: true,
    },
    city: {
      type: dataType.STRING,
      allowNull: false,
    },
    state: {
      type: dataType.STRING,
      allowNull: false,
    },
    country: {
      type: dataType.STRING,
      allowNull: false,
    },
    zipCode: {
      type: dataType.STRING,
      allowNull: false,
    },
  });

  deliveryAddress.associate = (models) => {
    deliveryAddress.belongsTo(models.users);
    deliveryAddress.hasMany(models.orders);
  };

  return deliveryAddress;
};

module.exports = deliveryAddress;
