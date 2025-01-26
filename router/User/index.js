const express = require("express");
const { signupRouter } = require("./signup");
const { signinRouter } = require("./signin");
const { getUserRouter } = require("./getUser");
const { employeeSearchRouter } = require("./employeeSearch");

const router = express.Router();

router.use(signupRouter);
router.use(signinRouter);
router.use(getUserRouter);
router.use(employeeSearchRouter);
module.exports = { authRouter: router };
