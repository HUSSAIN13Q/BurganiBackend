const express = require("express");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const User = require("../../models/User");

const PasswordManager = require("../../helper/PasswordManager");
const validateRequest = require("../../middleware/validateRequest");
const { BadRequestError } = require("../../errors");

const router = express.Router();

const validators = [
  body("username").not().isEmpty().withMessage("Username is required"),
  body("password").trim().not().isEmpty().withMessage("Password is required"),
];

router.post("/signin", validators, validateRequest, async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return next(BadRequestError("Invalid credentials"));

  const passwordsMatch = await PasswordManager.compare(user.password, password);

  if (!passwordsMatch) return next(BadRequestError("Invalid credentials"));

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.status(200).json({ token });
});

module.exports = { signinRouter: router };
