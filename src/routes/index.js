const { login } = require("../handlers/admin/auth");
const {
  createUser,
  loginUser,
  verifyUser,
  reSendVerification,
} = require("../handlers/users/auth");
const authenticateToken = require("../middlewares/adminProtect.middleware");
const authUser = require("../middlewares/userProtect.middleware");
const admin = require("./admin");
const unAuth = require("./unAuthenticatedPath");
const users = require("./users");
const {
  signUpValidation,
  loginValidation,
  emailVerificationValidation,
  resendVerificationValidation,
} = require("./users/validations");

const route = require("express").Router();

route.use("/admin/login", login);
route.use("/admin", authenticateToken, admin);
route.use("/", unAuth);
route.use("/auth/sign-in", loginValidation, loginUser);
route.use("/auth/sign-up", signUpValidation, createUser);
route.use("/verification/:code", emailVerificationValidation, verifyUser);
route.use(
  "/auth/resend-verification/:email",
  resendVerificationValidation,
  reSendVerification
);
route.use("/user", authUser, users);

module.exports = route;
