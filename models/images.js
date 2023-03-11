const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const images = (sequelize, dataType) => {
  const images = sequelize.define("images", {
    url: {
      type: dataType.STRING,
      allowNull: false,
    },
  });

  images.associate = (models) => {
    images.belongsTo(models.products);
  };

  return images;
};

module.exports = images;
