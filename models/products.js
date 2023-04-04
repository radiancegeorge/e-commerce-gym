const { Sequelize, DataTypes } = require("sequelize");
const db = require("./");

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
    stockAmount: {
      type: dataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Must be a whole number",
        },
      },
    },
  });

  products.associate = (models) => {
    products.belongsToMany(models.colors, { through: "productColors" });
    products.belongsToMany(models.sizes, { through: "productSizes" });
    products.belongsToMany(models.users, { through: "usersWishList" });
    products.belongsTo(models.collections);
    products.belongsTo(models.coupons);
    products.belongsTo(models.categories);
    products.hasMany(models.images, {
      onDelete: "cascade",
    });
  };

  return products;
};

module.exports = products;
