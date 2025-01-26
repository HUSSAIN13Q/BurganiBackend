const express = require("express");
const router = express.Router();
const Attendance = require("../../models/Attendance");
const { requireAuth } = require("../../middleware");

router.get("/today", requireAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const attendance = await Attendance.findOne({
      user_id: req.user.id,
      date: today,
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today" });
    }

    res.status(200).json({
      message: "Today's attendance retrieved successfully",
      attendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
