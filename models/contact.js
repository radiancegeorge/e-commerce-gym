const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const contact = (sequelize, dataType) => {
  const contact = sequelize.define("contact", {
    name: {
      type: dataType.STRING,
      allowNull: false,
    },
    email: {
      type: dataType.STRING,
      allowNull: false,
    },
    subject: {
      type: dataType.STRING,
      allowNull: true,
    },
    message: {
      type: dataType.TEXT,
      allowNull: false,
    },
  });

  return contact;
};

module.exports = contact;
