const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const User = require("../../models/User");
const Leave = require("../../models/Leaves");
const { requireAuth } = require("../../middleware");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Individual Employee Insights Endpoint
router.get("/insights/:employeeId", requireAuth, async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Fetch the employee details
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "Employee") {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch employee leave data
    const approvedLeaves = await Leave.countDocuments({
      user_id: employeeId,
      status: "Approved",
    });

    const pendingLeaves = await Leave.countDocuments({
      user_id: employeeId,
      status: "Pending",
    });

    // Construct AI prompt
    const messages = [
      {
        role: "system",
        content:
          "You are an AI assistant helping a manager analyze employee data.",
      },
      {
        role: "user",
        content: `
        Employee Name: ${employee.name}
        Title: ${employee.title}
        Approved Leaves: ${approvedLeaves}
        Pending Leaves: ${pendingLeaves}

        Provide actionable insights for the manager regarding this employee. 
        Suggest whether the employee might need a break, how to handle pending leave requests, and if there are any performance or workload considerations to account for.
        `,
      },
    ];

    // Call GPT-3.5-Turbo
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
    });

    const insights = response.choices[0].message.content.trim();

    res.status(200).json({
      message: "Employee insights generated successfully",
      employee: {
        name: employee.name,
        title: employee.title,
        approvedLeaves,
        pendingLeaves,
      },
      insights,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { performanceRouter: router };
