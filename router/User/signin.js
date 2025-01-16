const express = require("express");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const User = require("../../models/User");

const PasswordManager = require("../../helper/PasswordManager");
const validateRequest = require("../../middleware/validateRequest");
const { BadRequestError } = require("../../errors");

const router = express.Router();

const validators = [
  body("email").not().isEmpty().withMessage("email is required"),
  body("password").trim().not().isEmpty().withMessage("Password is required"),
];

router.post("/signin", validators, validateRequest, async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(BadRequestError("Invalid credentials"));

  const passwordsMatch = await PasswordManager.compare(user.password, password);

  if (!passwordsMatch) return next(BadRequestError("Invalid credentials"));

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      title: user.title,
    },
  });
});

module.exports = { signinRouter: router };
