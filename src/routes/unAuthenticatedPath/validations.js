const { query } = require("express-validator");

exports.getProductsValidation = [
  query(["collections", "colors", "sizes", "categories"]).default([]).isArray(),
  query(["page", "limit"]).default(1).toInt().isInt(),
];
