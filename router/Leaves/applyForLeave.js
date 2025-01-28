// const express = require("express");
// const router = express.Router();
// const Leave = require("../../models/Leaves");
// const LeaveBalance = require("../../models/LeaveBalance");
// const { requireAuth } = require("../../middleware");

// router.post("/", requireAuth, async (req, res) => {
//   try {
//     const { type, start_date, end_date, description, medical_report } =
//       req.body;

//     const leaveDays =
//       (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1;

//     console.log("User ID:", req.user.id);

//     const leaveBalance = await LeaveBalance.findOne({ user_id: req.user.id });

//     if (!leaveBalance) {
//       console.log("Leave balance not found for user ID:", req.user.id);
//       return res.status(404).json({ message: "Leave balance not found" });
//     }

//     if (
//       type === "Annual" &&
//       leaveBalance.annual_used + leaveDays > leaveBalance.annual_entitlement
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Insufficient annual leave balance" });
//     }

//     if (
//       type === "Sick" &&
//       leaveBalance.sick_used + leaveDays > leaveBalance.sick_entitlement
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Insufficient sick leave balance" });
//     }

//     const leave = await Leave.create({
//       user_id: req.user.id,
//       type,
//       start_date,
//       end_date,
//       description,
//       medical_report,
//       status: "Pending",
//     });

//     res
//       .status(201)
//       .json({ message: "Leave request submitted successfully", leave });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = { applyLeaveRouter: router };
const express = require("express");
const router = express.Router();
const Leave = require("../../models/Leaves");
const LeaveBalance = require("../../models/LeaveBalance");
const { requireAuth } = require("../../middleware");

router.post("/", requireAuth, async (req, res) => {
  try {
    const { type, start_date, end_date, description, medical_report } =
      req.body;

    const leaveDays =
      (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1;

    console.log("User ID:", req.user.id);

    const leaveBalance = await LeaveBalance.findOne({ user_id: req.user.id });

    if (!leaveBalance) {
      console.log("Leave balance not found for user ID:", req.user.id);
      return res.status(404).json({ message: "Leave balance not found" });
    }

    if (
      type === "Annual" &&
      leaveBalance.annual_used + leaveDays > leaveBalance.annual_entitlement
    ) {
      return res
        .status(400)
        .json({ message: "Insufficient annual leave balance" });
    }

    if (
      type === "Sick" &&
      leaveBalance.sick_used + leaveDays > leaveBalance.sick_entitlement
    ) {
      return res
        .status(400)
        .json({ message: "Insufficient sick leave balance" });
    }

    const leave = await Leave.create({
      user_id: req.user.id,
      type,
      start_date,
      end_date,
      description,
      medical_report,
      status: "Pending",
    });

    res
      .status(201)
      .json({ message: "Leave request submitted successfully", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { applyLeaveRouter: router };
