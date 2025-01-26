const express = require("express");
const router = express.Router();
const Attendance = require("../../models/Attendance");
const { isWithinGeofence } = require("../../geofencing");
const { requireAuth } = require("../../middleware");
const { OFFICE_LOCATION, ALLOWED_RADIUS } = require("../../location/tude");

router.post("/checkOut", requireAuth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    // Check if the user is within the geofence
    const withinGeofence = isWithinGeofence(
      OFFICE_LOCATION,
      { latitude, longitude },
      ALLOWED_RADIUS
    );

    if (!withinGeofence) {
      return res
        .status(403)
        .json({ message: "You are outside the allowed geofencing area" });
    }

    const today = new Date().toISOString().split("T")[0];
    console.log("Today's Date:", today);

    const existingAttendance = await Attendance.findOne({
      user_id: req.user.id,
      date: today,
    });

    if (!existingAttendance) {
      return res.status(400).json({ message: "You have not checked in today" });
    }

    if (existingAttendance.check_out_time) {
      return res
        .status(405)
        .json({ message: "You have already checked out today" });
    }

    const checkOutTime = new Date();
    const workHours =
      Math.abs(
        new Date(checkOutTime) - new Date(existingAttendance.check_in_time)
      ) / 3600000;

    existingAttendance.check_out_time = checkOutTime;
    existingAttendance.work_hours = workHours;
    await existingAttendance.save();

    res.status(200).json({
      message: "Checked out successfully",
      attendance: existingAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
