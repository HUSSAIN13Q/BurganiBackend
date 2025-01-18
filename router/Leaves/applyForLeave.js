const express = require("express");
const Leave = require("../../models/Leaves.js");
const User = require("../../models/User");
const router = express.Router();
const { body } = require("express-validator");
const { requireAuth, validateRequest } = require("../../middleware");

router.post(
  "/",
  requireAuth,
  [
    body("type").isString().withMessage("Leave type is required"),
    body("start_date").isISO8601().withMessage("Valid start date is required"),
    body("end_date").isISO8601().withMessage("Valid end date is required"),
    body("description").optional().isString(),
    body("medical_report").optional().isString(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      console.log("req.user:", req.user);

      const { type, start_date, end_date, description, medical_report } =
        req.body;

      const userDoc = await User.findById(req.user.id);
      if (!userDoc) {
        return res.status(404).json({ message: "User not found" });
      }

      const newLeave = new Leave({
        user_id: req.user.id,
        type,
        start_date,
        end_date,
        description,
        medical_report,
      });
      console.log("New Leave Data:", newLeave);

      await newLeave.save();
      console.log("UserDoc:", userDoc);

      res
        .status(201)
        .json({ message: "Leave request submitted", leave: newLeave });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = { applyLeaveRouter: router };
