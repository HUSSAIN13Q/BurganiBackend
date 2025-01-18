const express = require("express");
const { applyLeaveRouter } = require("./applyForLeave");
const { getLeaveRouter } = require("./getLeaves");

const router = express.Router();

router.use(applyLeaveRouter);
router.use(getLeaveRouter);

module.exports = { LeaveRouter: router };
