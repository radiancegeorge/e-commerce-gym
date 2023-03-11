const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const reviews = (sequelize, dataType) => {
  const reviews = sequelize.define("reviews", {
    text: {
      type: dataType.TEXT,
      allowNull: false,
    },
  });
  reviews.associate = (models) => {
    reviews.belongsTo(models.products);
    reviews.belongsTo(models.users);
  };
  return reviews;
};

module.exports = reviews;
