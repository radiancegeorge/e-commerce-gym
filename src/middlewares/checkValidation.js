const { validationResult } = require("express-validator");

const checkValidation = async (req) => {
  const errors = validationResult(req);
  //   console.log(errors);
  if (!errors.isEmpty()) {
    throw { status: 400, errors: errors.array() };
  }
};

module.exports = checkValidation;
