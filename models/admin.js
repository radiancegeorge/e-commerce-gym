const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
const admin = (sequelize, dataTypes) => {
  const admin = sequelize.define("admin", {
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: "email",
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: "password",
    },
  });
  /**
   *
   * @param {string} email
   * @param {string} password
   */
  admin.createAccount = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, process.env.SALT ?? 10);
    const newAdmin = await admin.create({
      email,
      password: hashedPassword,
    });

    return { email: newAdmin.email, status: "created" };
  };

  admin.isAdmin = async (email, password) => {
    const user = await admin.findOne({
      where: {
        email,
      },
    });
    if (!user) return false;
    //test password

    return await user.testPassword(password);
  };

  /**
   *
   * @param {string} password
   */
  admin.prototype.testPassword = async (password) => {
    return await bcrypt.compare(password, this.password);
  };

  return admin;
};

module.exports = admin;
