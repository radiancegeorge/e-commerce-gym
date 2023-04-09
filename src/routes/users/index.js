const { createOrder } = require("../../handlers/users/order");
const {
  getWishList,
  addToWishList,
  removeFromList,
} = require("../../handlers/users/product");
const {
  getWishListValidation,
  productIdsValidations,
  ordersValidation,
} = require("./validations");

const users = require("express").Router();

users
  .route("/wishlist")
  .get(getWishListValidation, getWishList)
  .put(productIdsValidations, addToWishList)
  .delete(productIdsValidations, removeFromList);

users.route("/order").post(ordersValidation, createOrder);

module.exports = users;
