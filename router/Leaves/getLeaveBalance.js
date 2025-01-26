const express = require("express");
const router = express.Router();
const LeaveBalance = require("../../models/LeaveBalance");

const { requireAuth } = require("../../middleware");

router.get("/leaveBalance", requireAuth, async (req, res) => {
  try {
    const leaveBalance = await LeaveBalance.findOne({ user_id: req.user.id });

    if (!leaveBalance) {
      return res.status(404).json({ message: "Leave balance not found" });
    }

    res.status(200).json({
      message: "Leave balance retrieved successfully",
      leaveBalance,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = { balanceLeaveRouter: router };
