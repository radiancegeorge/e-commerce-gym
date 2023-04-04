const {
  getWishList,
  addToWishList,
  removeFromList,
} = require("../../handlers/users/product");
const {
  getWishListValidation,
  productIdsValidations,
} = require("./validations");

const users = require("express").Router();

users
  .route("/wishlist")
  .get(getWishListValidation, getWishList)
  .put(productIdsValidations, addToWishList)
  .delete(productIdsValidations, removeFromList);

module.exports = users;
