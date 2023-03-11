const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const collections = (sequelize, dataTypes) => {
  const collections = sequelize.define("collections", {
    name: {
      type: dataType.STRING,
      allowNull: false,
    },
  });

  collections.associate = (models) => {
    collections.hasMany(models.products);
  };
  return collections;
};

module.exports = collections;
