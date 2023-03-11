const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const products = (sequelize, dataTypes) => {
  const products = sequelize.define("products", {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: dataTypes.FLOAT,
      allowNull: false,
    },
  });

  products.associate = (models) => {
    products.belongsToMany(models.colors, { through: "productColors" });
    products.belongsToMany(models.sizes, { through: "productSizes" });
    products.belongsTo(models.collections);
    products.belongsTo(models.categories);
  };

  return products;
};

module.exports = products;
