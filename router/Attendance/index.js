const express = require("express");

const checkIn = require("./checkIn");
const checkOut = require("./checkout");
const router = express.Router();

router.use(checkIn);
router.use(checkOut);

module.exports = { AttendanceRouter: router };
