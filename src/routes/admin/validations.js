const { body, param, query } = require("express-validator");

//collections
exports.collectionsCreationValidation = [
  body(["header1", "header2"]).optional().isString(),
  body("name").not().isEmpty(),
];

exports.collectionUpdateValidation = [param("id").isNumeric()];

//colors
exports.colorCreationValidation = [body("name").not().isEmpty()];

exports.colorIdValidation = [param("id").isNumeric()];

//products
exports.productsCreationValidation = [
  body(["name", "description", "price", "stockAmount"]).not().isEmpty(),
];
exports.productsIdValidation = [param("id").isNumeric()];
exports.productsPriceUpdateValidation = [
  body("price").optional(),
  body("stockAmount").optional().isInt(),
];
exports.productsColorValidation = [
  body("colorIds").isArray().isLength({ min: 1 }),
];
exports.productsSizeValidation = [
  body("sizeIds").isArray().isLength({ min: 1 }),
];
exports.productsCategoriesValidation = [body("categoryId").toInt().isInt()];
exports.productsCollectionValidation = [body("collectionId").toInt().isInt()];

//coupons

exports.couponCreationValidation = [
  body("expiryDate").toDate(),
  body("discount")
    .toInt()
    .isInt()
    .custom((num) => {
      if (num > 100 || num === 0 || num < 0)
        throw "cannot be greater than 100 or equal to 0";
      return true;
    }),
  body(["code", "id"]).isEmpty(),
];
exports.couponIdValidation = [param("id").isNumeric()];
exports.couponUpdateValidation = [
  body("expiryDate").optional().toDate(),
  body("discount")
    .optional()
    .toInt()
    .isInt()
    .custom((num) => {
      if (num > 100 || num === 0 || num < 0)
        throw "cannot be greater than 100 or equal to 0";
      return true;
    }),
  body(["code", "id"]).custom((item) => {
    if (item) throw "invalid param";
    return true;
  }),
];
exports.allGetListValidation = [query(["limit", "page"]).toInt().default(1)];

//sizes
exports.createSizesValidation = [body("name").not().isEmpty()];

//faq
exports.createFaqValidation = [
  body(["question", "answer"]).isLength({ min: 2 }),
];
exports.updateFaqValidation = [
  body(["question", "answer"]).optional().isLength({ min: 2 }),
];

//categories
exports.createCategoriesValidation = [body("name").not().isEmpty()];

//coupons products
exports.couponsProductValidation = [
  body("productIds").isArray().isLength({ min: 1 }),
];

exports.toggleOrderValidation = [param("orderId").trim().notEmpty()];
