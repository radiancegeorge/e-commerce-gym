const {
  createCollection,
  deleteCollection,
  updateCollection,
} = require("../../handlers/admin/collections");
const {
  collectionsCreationValidation,
  collectionUpdateValidation,
} = require("./validations");

const admin = require("express").Router();

admin
  .route("/collection/:id?")
  .post(collectionsCreationValidation, createCollection)
  .delete(collectionUpdateValidation, deleteCollection)
  .patch(collectionUpdateValidation, updateCollection);

module.exports = admin;
