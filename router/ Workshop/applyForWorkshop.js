const express = require("express");
const User = require("../../models/User");
const Workshop = require("../../models/ Workshop");
const router = express.Router();
const { requireAuth } = require("../../middleware");

router.post("/:workshop_id/apply", requireAuth, async (req, res) => {
  try {
    const { workshop_id } = req.params;
    const user_id = req.user.id;

    // Find the workshop by ID
    const workshop = await Workshop.findById(workshop_id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Check if the user has already applied for the workshop
    const alreadyApplied = workshop.applicants.some(
      (applicant) => applicant.user_id.toString() === user_id
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this workshop" });
    }

    // Add the user to the applicants list
    workshop.applicants.push({ user_id });
    await workshop.save();

    res
      .status(200)
      .json({ message: "Applied for workshop successfully", workshop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = { applyForWorkshop: router };
