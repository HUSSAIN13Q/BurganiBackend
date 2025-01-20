const express = require("express");
const Leave = require("../../models/Leaves.js");
const User = require("../../models/User.js");
const router = express.Router();
const { requireAuth } = require("../../middleware/index.js");

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

module.exports = { getMyLeaveRouter: router };
