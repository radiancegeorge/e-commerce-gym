const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../../handlers/admin/categories");
const {
  createCollection,
  deleteCollection,
  updateCollection,
  getCollections,
} = require("../../handlers/admin/collections");
const {
  createColor,
  deleteColor,
  updateColor,
  getColors,
} = require("../../handlers/admin/colors");
const {
  createCoupons,
  getCoupons,
  updateCoupons,
  deleteCoupons,
} = require("../../handlers/admin/coupons");
const {
  getFaq,
  deleteFaq,
  updateFaq,
  createFaq,
} = require("../../handlers/admin/faqs");
const {
  createProduct,
  deleteProduct,
  updateProductPrice,
} = require("../../handlers/admin/products");
const {
  getSizes,
  createSizes,
  deleteSizes,
  updateSizes,
} = require("../../handlers/admin/sizes");
const upload = require("../../middlewares/imagesFilterUploads");
const {
  collectionsCreationValidation,
  collectionUpdateValidation,
  productsCreationValidation,
  productsIdValidation,
  productsPriceUpdateValidation,
  colorCreationValidation,
  colorIdValidation,
  couponCreationValidation,
  allGetListValidation,
  couponIdValidation,
  couponUpdateValidation,
  createSizesValidation,
  updateFaqValidation,
  createFaqValidation,
  createCategoriesValidation,
} = require("./validations");

const admin = require("express").Router();

admin
  .route("/collection/:id?")
  .post(collectionsCreationValidation, createCollection)
  .delete(collectionUpdateValidation, deleteCollection)
  .patch(collectionUpdateValidation, updateCollection)
  .get(allGetListValidation, getCollections);

admin
  .route("/color/:id?")
  .post(colorCreationValidation, createColor)
  .delete(colorIdValidation, deleteColor)
  .patch(colorIdValidation, updateColor)
  .get(allGetListValidation, getColors);

admin
  .route("/product/:id?")
  .post(upload.array("images", 6), productsCreationValidation, createProduct)
  .delete(productsIdValidation, deleteProduct)
  .patch(
    productsPriceUpdateValidation,
    productsIdValidation,
    updateProductPrice
  );

admin
  .route("/coupon/:id?")
  .post(couponCreationValidation, createCoupons)
  .delete(couponIdValidation, deleteCoupons)
  .get(allGetListValidation, getCoupons)
  .patch(couponIdValidation, couponUpdateValidation, updateCoupons);

admin
  .route("/size/:id?")
  .get(allGetListValidation, getSizes)
  .post(createSizesValidation, createSizes)
  .delete(colorIdValidation, deleteSizes)
  .patch(colorIdValidation, createSizesValidation, updateSizes);
admin
  .route("/category/:id?")
  .get(allGetListValidation, getCategories)
  .post(createCategoriesValidation, createCategory)
  .delete(colorIdValidation, deleteCategory)
  .patch(colorIdValidation, createSizesValidation, updateCategory);

admin
  .route("/faq/:id?")
  .get(allGetListValidation, getFaq)
  .delete(colorIdValidation, deleteFaq)
  .patch(updateFaqValidation, updateFaq)
  .post(createFaqValidation, createFaq);
module.exports = admin;
