const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const categories = (sequelize, dataTypes) => {
  const categories = sequelize.define("categories", {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });

  categories.associate = (models) => {
    categories.hasMany(models.products);
  };

  return categories;
};

module.exports = categories;
