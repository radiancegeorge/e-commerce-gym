const { Sequelize, DataTypes } = require("sequelize");
const getTemplate = require("../src/utils/templateReader");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */

const emailVerifications = (sequelize, dataTypes) => {
  const emailVerifications = sequelize.define("emailVerifications", {
    code: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });

  emailVerifications.associate = (model) => {
    emailVerifications.belongsTo(model.users);
  };
  return emailVerifications;
};

module.exports = emailVerifications;
