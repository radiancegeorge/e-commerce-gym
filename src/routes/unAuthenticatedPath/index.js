const { getCategories } = require("../../handlers/admin/categories");
const { getCollections } = require("../../handlers/admin/collections");
const { getColors } = require("../../handlers/admin/colors");
const { getCoupons } = require("../../handlers/admin/coupons");
const { getFaq } = require("../../handlers/admin/faqs");
const { getSizes } = require("../../handlers/admin/sizes");
const {
  getProducts,
  getSingleProduct,
} = require("../../handlers/users/product");
const { allGetListValidation } = require("../admin/validations");
const { getProductsValidation } = require("./validations");

const unAuth = require("express").Router();

unAuth.route("/collection/:id?").get(allGetListValidation, getCollections);
unAuth.route("/color/:id?").get(allGetListValidation, getColors);
unAuth.route("/coupon/:id?").get(allGetListValidation, getCoupons);
unAuth.route("/size/:id?").get(allGetListValidation, getSizes);
unAuth.route("/category/:id?").get(allGetListValidation, getCategories);
unAuth.route("/faq/:id?").get(allGetListValidation, getFaq);
unAuth.route("/product").get(getProductsValidation, getProducts);
unAuth.route("/product/:id").get(getSingleProduct);

module.exports = unAuth;
