const { query } = require("express-validator");

exports.getProductsValidation = [
  query(["collections", "colors", "sizes", "categories"]).default([]).isArray(),
  query(["page", "limit"]).default(1).toInt().isInt(),
  query("sudo").default(false).toBoolean(),
];

exports.limitsValidation = [
  query("limit").default(10).toInt().isInt(),
  query("page").default(1).toInt().isInt(),
];
exports.randValidation = [query("limit").default(8).toInt()];
