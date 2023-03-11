const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const ratings = (sequelize, dataType) => {
  const ratings = sequelize.define("ratings", {
    value: {
      type: dataType.INTEGER(5),
      allowNull: false,
    },
  });
  ratings.associate = (models) => {
    ratings.belongsTo(models.products);
    ratings.belongsTo(models.users);
  };
  return ratings;
};

module.exports = ratings;
