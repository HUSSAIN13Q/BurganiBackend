const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Community = require("../../models/communities/Community");

router.post(
  "/",
  [
    body("title").isString().withMessage("Title is required"),
    body("description").isString().withMessage("Description is required"),
  ],
  async (req, res) => {
    try {
      const { title, description } = req.body;

      const community = new Community({
        title,
        description,
        created_by: req.user._id,
        members: [req.user._id],
      });

      await community.save();

      res
        .status(201)
        .json({ message: "Community created successfully", community });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
