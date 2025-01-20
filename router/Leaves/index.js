const express = require("express");
const { applyLeaveRouter } = require("./applyForLeave");
const { getMyLeaveRouter } = require("./getMyLeaves");
const { getLeaveRouter } = require("./getLeaves");

const router = express.Router();

router.use(applyLeaveRouter);
router.use(getMyLeaveRouter);
router.use(getLeaveRouter);

module.exports = { LeaveRouter: router };
