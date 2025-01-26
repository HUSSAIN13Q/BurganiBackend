const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { requireAuth } = require("../../middleware");

// Employee Search Endpoint
router.get("/search", requireAuth, async (req, res) => {
  try {
    const { name, department, location, title, sort } = req.query;

    // Build the search query
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    if (department) query.department = { $regex: department, $options: "i" }; // Match exact department ID
    if (location) query.location = { $regex: location, $options: "i" }; // Case-insensitive search
    if (title) query.title = { $regex: title, $options: "i" }; // Case-insensitive search
    // const sort = req.query.sort || "name";
    const sortOrder = sort ? { [sort]: 1 } : { name: 1 };
    const employees = await User.find({ ...query })
      .select("name email location title department ")
      .sort(sortOrder);

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { employeeSearchRouter: router };
