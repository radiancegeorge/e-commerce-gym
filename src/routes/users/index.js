const { me } = require("../../handlers/users/auth");
const {
  createOrder,
  getOrders,
  createAddress,
  getAddresses,
} = require("../../handlers/users/order");
const {
  getWishList,
  addToWishList,
  removeFromList,
} = require("../../handlers/users/product");
const {
  getWishListValidation,
  productIdsValidations,
  ordersValidation,
  getOrderValidations,
  createAddressValidation,
} = require("./validations");

const users = require("express").Router();

users
  .route("/wishlist")
  .get(getWishListValidation, getWishList)
  .put(productIdsValidations, addToWishList)
  .delete(productIdsValidations, removeFromList);

users
  .route("/order/:id?")
  .post(ordersValidation, createOrder)
  .get(getOrderValidations, getOrders);

users.route("/me").get(me);

users
  .route("/address")
  .post(createAddressValidation, createAddress)
  .get(getAddresses);
module.exports = users;
