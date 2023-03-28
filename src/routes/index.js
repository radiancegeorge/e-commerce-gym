const { login } = require("../handlers/admin/auth");
const authenticateToken = require("../middlewares/adminProtect.middleware");
const admin = require("./admin");

const route = require("express").Router();

route.use("/admin/login", login);
route.use("/admin", authenticateToken, admin);

module.exports = route;
