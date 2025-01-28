const express = require("express");
const { signupRouter } = require("./signup");
const { signinRouter } = require("./signin");
const { getUserRouter } = require("./getUser");
const { employeeSearchRouter } = require("./employeeSearch");
const { departmentEmployeesRouter } = require("./employeesbyDepartment");

const router = express.Router();

router.use(signupRouter);
router.use(signinRouter);
router.use(getUserRouter);
router.use(employeeSearchRouter);
router.use(departmentEmployeesRouter);
module.exports = { authRouter: router };
