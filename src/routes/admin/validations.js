const { body, param } = require("express-validator");

//collections
exports.collectionsCreationValidation = [
  body(["header1", "header2"]).optional().isString(),
  body("name").not().isEmpty(),
];

exports.collectionUpdateValidation = [param("id").isNumeric()];
