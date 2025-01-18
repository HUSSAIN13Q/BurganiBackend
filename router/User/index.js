const express = require("express");
const { signupRouter } = require("./signup");
const { signinRouter } = require("./signin");
const { getUserRouter } = require("./getUser");

const router = express.Router();

router.use(signupRouter);
router.use(signinRouter);
router.use(getUserRouter);

module.exports = { authRouter: router };
