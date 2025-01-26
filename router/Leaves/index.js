const express = require("express");
const { applyLeaveRouter } = require("./applyForLeave");
const { getMyLeaveRouter } = require("./getMyLeaves");
const { getLeaveRouter } = require("./getLeaves");
const { approveLeaveRouter } = require("./approveLeave");
const { rejectLeaveRouter } = require("./rejectLeave");
const { aiLeaveRouter } = require("./aiVacation");
const { performanceRouter } = require("./performanceAi");
const { balanceLeaveRouter } = require("./getLeaveBalance");

const router = express.Router();

router.use(applyLeaveRouter);
router.use(getMyLeaveRouter);
router.use(getLeaveRouter);
router.use(approveLeaveRouter);
router.use(rejectLeaveRouter);
router.use(aiLeaveRouter);
router.use(performanceRouter);
router.use(balanceLeaveRouter);

module.exports = { LeaveRouter: router };
