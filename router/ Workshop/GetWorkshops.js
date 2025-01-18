const express = require("express");
const Workshop = require("../../models/ Workshop");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const workshops = await Workshop.find({})
      .populate("created_by", "name email")
      .populate("applicants.user_id", "name email -_id");
    res.status(200).json(workshops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { getWorkshop: router };
