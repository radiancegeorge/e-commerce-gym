const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const sizes = (sequelize, dataTypes) => {
  const sizes = sequelize.define("sizes", {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: "name",
    },
  });
  return sizes;
};

module.exports = sizes;
