const express = require("express");

const checkIn = require("./checkIn");
const checkOut = require("./checkout");
const getTodayAttendance = require("./getTodayAttendance");
const router = express.Router();

router.use(checkIn);
router.use(checkOut);
router.use(getTodayAttendance);

module.exports = { AttendanceRouter: router };
