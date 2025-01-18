const express = require("express");
const User = require("../../models/User");
const Workshop = require("../../models/ Workshop");
const router = express.Router();
const { requireAuth } = require("../../middleware");

router.post("/apply", requireAuth, async (req, res) => {
  try {
    const { workshop_id } = req.body;

    const workshop = await Workshop.findById(workshop_id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Check if user has already applied
    const alreadyApplied = workshop.applicants.some(
      (applicant) => applicant.user_id.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this workshop" });
    }

    // Add applicant
    workshop.applicants.push({ user_id: req.user.id });
    await workshop.save();

    res.status(201).json({ message: "Successfully applied for the workshop" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = { applyForWorkshop: router };
