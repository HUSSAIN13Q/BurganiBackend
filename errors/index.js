function CustomError({ message, status }) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function NotFoundError(message, status = 404) {
  return CustomError({ message, status });
}

function BadRequestError(message, status = 400) {
  return CustomError({ message, status });
}

function RequestValidationError(
  errors,
  message = "Invalid request parameters",
  status = 400
) {
  const err = CustomError({ message, status });

  err.response = errors.map((error) => {
    if (error.type === "field") {
      return { message: error.msg, field: error.path };
    }
    return { message: error.msg };
  });
  return err;
}

function NotAuthorizedError(message = "Not Authorized", status = 401) {
  return CustomError({ message, status });
}

module.exports = {
  NotFoundError,
  BadRequestError,
  RequestValidationError,
  NotAuthorizedError,
};
