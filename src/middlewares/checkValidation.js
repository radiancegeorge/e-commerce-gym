const { validationResult, matchedData } = require("express-validator");

const checkValidation = async (req) => {
  const errors = validationResult(req);
  //   console.log(errors);
  if (!errors.isEmpty()) {
    throw { status: 400, errors: errors.array() };
  }
  return matchedData(req);
};

module.exports = checkValidation;
