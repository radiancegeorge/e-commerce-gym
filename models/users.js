const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const users = (sequelize, dataTypes) => {
  const users = sequelize.define("users", {
    firstName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Field has to be an email",
        },
      },
    },
    verified: {
      type: dataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phoneNumber: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  users.associate = (models) => {
    users.hasMany(models.reviews);
    users.hasMany(models.orders);
    users.hasMany(models.deliveryAddress);
  };
  return users;
};

module.exports = users;
