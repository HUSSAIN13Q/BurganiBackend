const express = require("express");
const { signupRouter } = require("./signup");
const { signinRouter } = require("./signin");

const router = express.Router();

router.use(signupRouter);
router.use(signinRouter);

module.exports = { authRouter: router };
