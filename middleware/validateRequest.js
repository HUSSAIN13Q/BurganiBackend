const { validationResult } = require("express-validator");

const { RequestValidationError } = require("../errors");

const validateRequest = function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};

module.exports = validateRequest;
