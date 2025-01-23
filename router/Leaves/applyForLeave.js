// const express = require("express");
// const Leave = require("../../models/Leaves.js");
// const User = require("../../models/User");
// const router = express.Router();
// const { body } = require("express-validator");
// const { requireAuth, validateRequest } = require("../../middleware");

// router.post(
//   "/",

//   [
//     body("type").isString().withMessage("Leave type is required"),
//     body("start_date").isISO8601().withMessage("Valid start date is required"),
//     body("end_date").isISO8601().withMessage("Valid end date is required"),
//     body("description").optional().isString(),
//     body("medical_report").optional().isString(),
//   ],
//   validateRequest,
//   async (req, res) => {
//     try {
//       console.log("req.user:", req.user);

//       const { type, start_date, end_date, description, medical_report } =
//         req.body;

//       const userDoc = await User.findById(req.user.id);
//       if (!userDoc) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const newLeave = new Leave({
//         user_id: req.user.id,
//         type,
//         start_date,
//         end_date,
//         description,
//         medical_report,
//       });
//       console.log("New Leave Data:", newLeave);

//       await newLeave.save();
//       console.log("UserDoc:", userDoc);

//       res
//         .status(201)
//         .json({ message: "Leave request submitted", leave: newLeave });
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: error.message });
//     }
//   }
// );

// module.exports = { applyLeaveRouter: router };

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

//     const leaveBalance = await LeaveBalance.findOne({ user_id: req.user._id });

//     if (!leaveBalance) {
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
//       user_id: req.user._id,
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
