const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const colors = (sequelize, dataTypes) => {
  const colors = sequelize.define("colors", {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  colors.associate = (models) => {
    colors.belongsToMany(models.products, { through: "productColors" });
  };

  return colors;
};

module.exports = colors;
