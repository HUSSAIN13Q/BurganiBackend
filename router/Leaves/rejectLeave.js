const express = require("express");
const router = express.Router();
const Leave = require("../../models/Leaves");
const { requireAuth } = require("../../middleware");

router.patch("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Leave request is already processed" });
    }

    leave.status = "Rejected";
    await leave.save();

    res.status(200).json({ message: "Leave request rejected", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { rejectLeaveRouter: router };
