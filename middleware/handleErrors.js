const handleErrors = function (err, req, res, next) {
  console.error(err);
  res.status(err.status ?? 500).json({
    errors: err.response ?? [
      { message: err.message ?? "Internal Server Error" },
    ],
  });
};

module.exports = handleErrors;
