const express = require("express");
const Leave = require("../../models/Leaves.js");
const User = require("../../models/User.js");
const router = express.Router();
const { body } = require("express-validator");

router.get("/all", async (req, res) => {
  try {
    const leaves = await Leave.find().populate("user_id", "name");
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = { getLeaveRouter: router };
