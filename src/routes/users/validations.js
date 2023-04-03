const { body, param } = require("express-validator");

exports.signUpValidation = [
  body(["password", "firstName", "lastName", "rePassword", "email"])
    .trim()
    .notEmpty(),
  body("password")
    .custom((password, { req }) => {
      const { rePassword } = req.body;
      if (password !== rePassword) throw "Passwords are not a match!";
      return true;
    })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/),
  body("email").isEmail().normalizeEmail(),
];

exports.loginValidation = [body(["email", "password"]).trim().notEmpty()];

exports.emailVerificationValidation = [param("code").notEmpty()];

exports.resendVerificationValidation = [
  param("email").trim().notEmpty().isEmail().normalizeEmail(),
];
