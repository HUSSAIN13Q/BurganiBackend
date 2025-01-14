const { NotAuthorizedError } = require("../errors");

function requireAuth(req, res, next) {
  if (!req.user) throw NotAuthorizedError();

  next();
}

module.exports = requireAuth;
