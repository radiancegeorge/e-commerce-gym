const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const collections = (sequelize, dataTypes) => {
  const collections = sequelize.define("collections", {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: "collectionName",
    },
    header1: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    header2: {
      type: dataTypes.STRING,
      allowNull: true,
    },
  });

  collections.associate = (models) => {
    collections.hasMany(models.products);
  };
  return collections;
};

module.exports = collections;
