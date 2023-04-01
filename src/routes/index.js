const { login } = require("../handlers/admin/auth");
const authenticateToken = require("../middlewares/adminProtect.middleware");
const admin = require("./admin");
const unAuth = require("./unAuthenticatedPath");

const route = require("express").Router();

route.use("/admin/login", login);
route.use("/admin", authenticateToken, admin);
route.use("/", unAuth);
module.exports = route;
