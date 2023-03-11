const { Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 */
const faq = (sequelize, dataType) => {
  const faq = sequelize.define("faq", {
    question: {
      type: dataType.TEXT,
      allowNull: false,
    },
    answer: {
      type: dataType.TEXT,
      allowNull: false,
    },
  });

  return faq;
};

module.exports = faq;
