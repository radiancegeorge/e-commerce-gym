const { body, param, query } = require("express-validator");

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

exports.getWishListValidation = [
  query(["limit", "page"]).default(1).toInt().isInt(),
];

exports.productIdsValidations = [body("productIds").isArray({ min: 1 })];

exports.ordersValidation = [
  body("orders")
    .isArray({ min: 1 })
    .custom((orders) => {
      const fields = ["colorId", "productId", "sizeId", "quantity"];
      for (let order of orders) {
        const keys = Object.keys(order);
        //throws error if key not supported
        // for (let key of keys) {
        //   if (!fields.includes(key)) throw "Invalid key found in product";
        // }

        //throw error on missing fields
        for (let field of fields) {
          if (!keys.includes(field)) {
            throw `missing field ${field} in order`;
          }
        }
      }
      return true;
    }),
  body("paymentId").isString().trim().notEmpty(),
  body("couponCode").optional(),
  // body("source").isObject(),
  body("addressId").optional(),
  body("deliveryAddress")
    .optional()
    .isObject()
    .custom((deliveryAddress) => {
      const compulsoryFields = [
        "addressLine1",
        "city",
        "state",
        "country",
        "zipCode",
      ];

      for (let field of compulsoryFields) {
        const keys = Object.keys(deliveryAddress);
        if (!keys.includes(field)) {
          throw `missing field in address -  ${field}`;
        }
      }
      return true;
    }),
];
