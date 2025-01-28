// const express = require("express");
// const router = express.Router();
// const User = require("../../models/User");
// const Attendance = require("../../models/Attendance");
// const { requireAuth } = require("../../middleware");

// // Fetch employees by department for manager
// router.get("/department-employees", requireAuth, async (req, res) => {
//   try {
//     // Ensure the manager's department is available
//     const manager = await User.findById(req.user.id);
//     if (!manager || manager.role !== "Manager") {
//       return res.status(403).json({ message: "Access denied. Manager only." });
//     }

//     const department = manager.department;
//     if (!department) {
//       return res
//         .status(400)
//         .json({ message: "Manager's department not specified." });
//     }

//     // Fetch all employees in the manager's department
//     const employees = await User.find({ department, role: "Employee" });

//     if (!employees.length) {
//       return res
//         .status(404)
//         .json({ message: "No employees found in your department." });
//     }

//     const totalEmployees = employees.length;

//     // Today's date in ISO format
//     const today = new Date().toISOString().split("T")[0];

//     // Fetch employees who have attended today
//     const attendedEmployeeRecords = await Attendance.find({
//       date: today,
//     }).select("user_id");

//     const attendedEmployeeIds = attendedEmployeeRecords.map((record) =>
//       record.user_id.toString()
//     );

//     // Employees who have not attended today
//     const absentEmployees = employees.filter(
//       (employee) => !attendedEmployeeIds.includes(employee._id.toString())
//     );

//     const totalAbsentEmployees = absentEmployees.length;

//     res.status(200).json({
//       message: "Department employees retrieved successfully",
//       department,
//       totalEmployees,
//       totalAbsentEmployees,
//       employees: employees.map((employee) => ({
//         name: employee.name,
//         email: employee.email,
//         location: employee.location,
//         title: employee.title,
//       })),
//       absentEmployees: absentEmployees.map((employee) => ({
//         name: employee.name,
//         email: employee.email,
//         location: employee.location,
//         title: employee.title,
//       })),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = { departmentEmployeesRouter: router };
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Attendance = require("../../models/Attendance");
const { requireAuth } = require("../../middleware");

// Fetch employees by department for manager
router.get("/department-employees", requireAuth, async (req, res) => {
  try {
    // Ensure the manager's department is available
    const manager = await User.findById(req.user.id);
    if (!manager || manager.role !== "Manager") {
      return res.status(403).json({ message: "Access denied. Manager only." });
    }

    const department = manager.department;
    if (!department) {
      return res
        .status(400)
        .json({ message: "Manager's department not specified." });
    }

    // Fetch all employees in the manager's department
    const employees = await User.find({ department, role: "Employee" });

    if (!employees.length) {
      return res
        .status(404)
        .json({ message: "No employees found in your department." });
    }

    const totalEmployees = employees.length;

    // Today's date in ISO format
    const today = new Date().toISOString().split("T")[0];

    // Fetch employees who have attended today
    const attendedEmployeeRecords = await Attendance.find({
      date: today,
    }).select("user_id");

    const attendedEmployeeIds = attendedEmployeeRecords.map((record) =>
      record.user_id.toString()
    );

    // Employees who have not attended today
    const absentEmployees = employees.filter(
      (employee) => !attendedEmployeeIds.includes(employee._id.toString())
    );

    const totalAbsentEmployees = absentEmployees.length;

    res.status(200).json({
      message: "Department employees retrieved successfully",
      department,
      totalEmployees,
      totalAbsentEmployees,
      employees: employees.map((employee) => ({
        id: employee._id,
        name: employee.name,
        email: employee.email,
        location: employee.location,
        title: employee.title,
      })),
      absentEmployees: absentEmployees.map((employee) => ({
        id: employee._id,
        name: employee.name,
        email: employee.email,
        location: employee.location,
        title: employee.title,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { departmentEmployeesRouter: router };
