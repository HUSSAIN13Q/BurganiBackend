const express = require("express");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const User = require("../../models/User");

const validateRequest = require("../../middleware/validateRequest");
const { BadRequestError } = require("../../errors");

const router = express.Router();

const validators = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("name").not().isEmpty().withMessage("Name is required"),
  body("role")
    .isIn(["Employee", "Manager", "HR"])
    .withMessage("Role is invalid"),
  body("location").optional().isString(),
  body("title").optional().isString(),
];

router.post("/signup", validators, validateRequest, async (req, res, next) => {
  const { password, name, email, role, location, title } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) return next(BadRequestError("Email is already in use"));

  const user = await User.create({
    password,
    name,
    email,
    role,
    location,
    title,
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.status(201).json({ token });
});

module.exports = { signupRouter: router };
