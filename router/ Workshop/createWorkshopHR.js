const express = require("express");
const User = require("../../models/User");
const Workshop = require("../../models/ Workshop");
const router = express.Router();
const { body } = require("express-validator");
const { requireAuth, requireHR, validateRequest } = require("../../middleware");

router.post(
  "/",
  requireAuth,
  requireHR,
  [
    body("title").isString().withMessage("Title is required"),
    body("description").isString().withMessage("Description is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { title, description, date } = req.body;

      const newWorkshop = new Workshop({
        title,
        description,
        date,
        created_by: req.user.id, // HR user ID
      });

      await newWorkshop.save();

      res.status(201).json({
        message: "Workshop created successfully",
        workshop: newWorkshop,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = { createWorkshop: router };
