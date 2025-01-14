const jwt = require("jsonwebtoken");

// Pull the token from the request
// It is a bearer token
function getBearerToken(req) {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    const [_, token] = authorization.split(" ");
    return token;
  }

  return null;
}

function currentUser(req, res, next) {
  const token = getBearerToken(req);

  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (error) {
    next(error);
  }

  next();
}

module.exports = currentUser;
