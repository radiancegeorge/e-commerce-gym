const { getCategories } = require("../../handlers/admin/categories");
const { getCollections } = require("../../handlers/admin/collections");
const { getColors } = require("../../handlers/admin/colors");
const { getCoupons } = require("../../handlers/admin/coupons");
const { getFaq } = require("../../handlers/admin/faqs");
const { getSizes } = require("../../handlers/admin/sizes");
const {
  getProducts,
  getSingleProduct,
  featuredProducts,
} = require("../../handlers/users/product");
const partialUserAuth = require("../../middlewares/partialUserAuth.middleware");
const { allGetListValidation } = require("../admin/validations");
const { getProductsValidation, randValidation } = require("./validations");

const unAuth = require("express").Router();

unAuth.route("/collection/:id?").get(allGetListValidation, getCollections);
unAuth.route("/color/:id?").get(allGetListValidation, getColors);
unAuth.route("/coupon/:id?").get(allGetListValidation, getCoupons);
unAuth.route("/size/:id?").get(allGetListValidation, getSizes);
unAuth.route("/category/:id?").get(allGetListValidation, getCategories);
unAuth.route("/faq/:id?").get(allGetListValidation, getFaq);
unAuth
  .route("/product")
  .get(partialUserAuth, getProductsValidation, getProducts);
unAuth
  .route("/product/random")
  .get(partialUserAuth, randValidation, featuredProducts);
unAuth.route("/product/:id").get(partialUserAuth, getSingleProduct);

module.exports = unAuth;
