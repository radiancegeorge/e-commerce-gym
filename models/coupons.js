const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const coupons = (sequelize, dataType) => {
  const coupons = sequelize.define("coupons", {
    code: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: dataType.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        max: 100,
      },
    },
    expiryDate: {
      type: dataType.DATEONLY,
      allowNull: true,
    },
  });

  coupons.associate = (models) => {
    coupons.hasMany(models.orders);
    coupons.hasMany(models.products);
  };

  return coupons;
};

module.exports = coupons;
