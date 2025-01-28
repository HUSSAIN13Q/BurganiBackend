// const express = require("express");
// const router = express.Router();
// const LeaveBalance = require("../../models/LeaveBalance");
// const Leave = require("../../models/Leaves");
// const OpenAI = require("openai");

// const { requireAuth } = require("../../middleware");

// const publicHolidays = [
//   { date: "2025-01-01", name: "New Year" },
//   { date: "2025-01-02", name: "New Year (Rest Day)" },
//   { date: "2025-01-27", name: "The Prophet's Ascension (Isra and Miraj)" },
//   { date: "2025-02-25", name: "National Day" },
//   { date: "2025-02-26", name: "Liberation Day" },
//   { date: "2025-03-31", name: "Eid Al Fitr" },
//   { date: "2025-04-01", name: "Eid Al Fitr Holiday" },
//   { date: "2025-04-02", name: "Eid Al Fitr Holiday" },
//   { date: "2025-06-06", name: "Eid Al Adha" },
//   { date: "2025-06-07", name: "Eid Al Adha Holiday" },
//   { date: "2025-06-26", name: "Islamic New Year" },
//   { date: "2025-09-04", name: "Prophet's Birthday" },
// ];

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.get("/recommendation", requireAuth, async (req, res) => {
//   try {
//     const leaveBalance = await LeaveBalance.findOne({ user_id: req.user.id });
//     if (!leaveBalance) {
//       return res.status(404).json({ message: "Leave balance not found" });
//     }

//     const availableDays =
//       leaveBalance.annual_entitlement - leaveBalance.annual_used;

//     const totalEmployees = await Leave.distinct("user_id").then(
//       (users) => users.length
//     );

//     // Calculate leave overlap for each public holiday
//     const leaveOverlap = {};
//     for (const holiday of publicHolidays) {
//       const leaveCount = await Leave.countDocuments({
//         status: "Approved",
//         start_date: { $lte: holiday.date },
//         end_date: { $gte: holiday.date },
//       });

//       leaveOverlap[holiday.date] = (
//         (leaveCount / totalEmployees) *
//         100
//       ).toFixed(2); // Percentage
//     }

//     const messages = [
//       {
//         role: "system",
//         content:
//           "You are an AI assistant helping an employee plan their vacation.",
//       },
//       {
//         role: "user",
//         content: `
//           The employee has ${availableDays} annual leave days remaining.
//           Here is the list of upcoming public holidays and the percentage of employees already on leave:
//           ${publicHolidays
//             .map(
//               (holiday) =>
//                 `${holiday.date}: ${holiday.name} - ${
//                   leaveOverlap[holiday.date] || 0
//                 }% of employees already on leave`
//             )
//             .join("\n")}.

//           Recommend the best time for them to take their vacation by combining leave days with public holidays
//           to maximize time off. If a public holiday already has a high overlap of employees on leave, suggest alternative days.
//           `,
//       },
//     ];

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages,
//       max_tokens: 300,
//     });

//     const recommendation = response.choices[0].message.content.trim();

//     res.status(200).json({
//       recommendation,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });
// module.exports = { aiLeaveRouter: router };
const express = require("express");
const router = express.Router();
const LeaveBalance = require("../../models/LeaveBalance");
const Leave = require("../../models/Leaves");
const OpenAI = require("openai");

const { requireAuth } = require("../../middleware");

const publicHolidays = [
  { date: "2025-01-01", name: "New Year" },
  { date: "2025-01-02", name: "New Year (Rest Day)" },
  { date: "2025-01-27", name: "The Prophet's Ascension (Isra and Miraj)" },
  { date: "2025-02-25", name: "National Day" },
  { date: "2025-02-26", name: "Liberation Day" },
  { date: "2025-03-31", name: "Eid Al Fitr" },
  { date: "2025-04-01", name: "Eid Al Fitr Holiday" },
  { date: "2025-04-02", name: "Eid Al Fitr Holiday" },
  { date: "2025-06-06", name: "Eid Al Adha" },
  { date: "2025-06-07", name: "Eid Al Adha Holiday" },
  { date: "2025-06-26", name: "Islamic New Year" },
  { date: "2025-09-04", name: "Prophet's Birthday" },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/recommendation", requireAuth, async (req, res) => {
  try {
    const leaveBalance = await LeaveBalance.findOne({ user_id: req.user.id });
    if (!leaveBalance) {
      return res.status(404).json({ message: "Leave balance not found" });
    }

    const availableDays =
      leaveBalance.annual_entitlement - leaveBalance.annual_used;

    const totalEmployees = await Leave.distinct("user_id").then(
      (users) => users.length
    );

    // Calculate leave overlap for each public holiday
    const leaveOverlap = {};
    for (const holiday of publicHolidays) {
      const leaveCount = await Leave.countDocuments({
        status: "Approved",
        start_date: { $lte: holiday.date },
        end_date: { $gte: holiday.date },
      });

      leaveOverlap[holiday.date] = (
        (leaveCount / totalEmployees) *
        100
      ).toFixed(2); // Percentage
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an AI assistant helping an employee plan their vacation. Provide concise, bullet-point recommendations.",
      },
      {
        role: "user",
        content: `
          The employee has ${availableDays} annual leave days remaining.
          Here is the list of upcoming public holidays and the percentage of employees already on leave:
          ${publicHolidays
            .map(
              (holiday) =>
                `${holiday.date}: ${holiday.name} - ${
                  leaveOverlap[holiday.date] || 0
                }% of employees already on leave`
            )
            .join("\n")}.
          
          Recommend the best time for them to take their vacation by combining leave days with public holidays 
          to maximize time off. If a public holiday already has a high overlap of employees on leave with %, suggest alternative days.
          Format the message as bullet points for clarity and remove  the **.
          `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 150,
    });

    const recommendation = response.choices[0].message.content
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line) // Remove empty lines
      .map((line) => `- ${line}`); // Format as bullet points

    res.status(200).json({
      recommendation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { aiLeaveRouter: router };
