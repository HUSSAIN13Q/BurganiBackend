const express = require("express");
const router = express.Router();
const Leave = require("../../models/Leaves");
const LeaveBalance = require("../../models/LeaveBalance");
const { requireAuth } = require("../../middleware");

router.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Leave request is already processed" });
    }

    const leaveDays =
      (new Date(leave.end_date) - new Date(leave.start_date)) /
        (1000 * 60 * 60 * 24) +
      1;

    const leaveBalance = await LeaveBalance.findOne({ user_id: leave.user_id });

    // if (leave.type === "Annual") {
    //   leaveBalance.annual_used += leaveDays;
    // } else if (leave.type === "Sick") {
    //   leaveBalance.sick_used += leaveDays;
    // }
    if (leave.type === "Sick") {
      leaveBalance.sick_used = leaveBalance.sick_used || 0; // Ensure sick_used is initialized
      leaveBalance.sick_used += 1;
    } else if (leave.type === "Annual") {
      leaveBalance.annual_used = leaveBalance.annual_used || 0; // Ensure annual_used is initialized
      leaveBalance.annual_used += 1;
    }

    await leaveBalance.save();

    leave.status = "Approved";
    await leave.save();

    res.status(200).json({ message: "Leave request approved", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = { approveLeaveRouter: router };
