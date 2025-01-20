const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Community = require("../../models/communities/Community");
const { requireAuth } = require("../../middleware");

router.post(
  "/",
  requireAuth,
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
        created_by: req.user.id,
        members: [req.user.id],
      });
      console.log("Community Data:", community);

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
