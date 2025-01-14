const { randomBytes, scrypt } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

const KEYLEN = 64;

async function toHash(password) {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt, KEYLEN);

  return `${buf.toString("hex")}.${salt}`;
}

async function compare(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split(".");

  const buf = await scryptAsync(suppliedPassword, salt, KEYLEN);

  return buf.toString("hex") === hashedPassword;
}

module.exports = { toHash, compare };
