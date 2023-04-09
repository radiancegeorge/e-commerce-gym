const { createOrder, getOrders } = require("../../handlers/users/order");
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

module.exports = users;
