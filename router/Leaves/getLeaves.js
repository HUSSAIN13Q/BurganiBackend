const express = require("express");
const Leave = require("../../models/Leaves");
const User = require("../../models/User");
const router = express.Router();
const { body } = require("express-validator");
const { requireAuth, validateRequest } = require("../../middleware");

router.get("/", requireAuth, async (req, res) => {
  try {
    const leaves = await Leave.find({ user_id: req.user.id }).populate(
      "user_id",
      "name email"
    );
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { getLeaveRouter: router };
