const express = require("express");
const router = express.Router();
const Attendance = require("../../models/Attendance");
const { isWithinGeofence } = require("../../geofencing");
const { requireAuth } = require("../../middleware");
const { OFFICE_LOCATION, ALLOWED_RADIUS } = require("../../location/tude");

router.post("/checkIn", requireAuth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Validate geolocation data
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

    // Check if the user has already checked in today
    console.log("User ID:", req.user.id);
    const today = new Date().toISOString().split("T")[0];
    const existingAttendance = await Attendance.findOne({
      user_id: req.user.id,
      date: today,
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "You have already checked in today" });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      user_id: req.user.id,
      check_in_time: new Date(),
      date: today,
      location: { latitude, longitude },
    });

    res.status(201).json({ message: "Checked in successfully", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
