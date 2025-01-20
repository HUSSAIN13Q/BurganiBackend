const express = require("express");
const { body } = require("express-validator");
const CommunityPost = require("../../models/communities/CommunityPost");
const Community = require("../../models/communities/Community");
const router = express.Router();

router.post(
  "/post",
  [
    body("community_id").isString().withMessage("Community ID is required"),
    body("content").isString().withMessage("Content is required"),
  ],
  async (req, res) => {
    try {
      const { community_id, content, image_url } = req.body;

      const community = await Community.findById(community_id);

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      // Check if the user is a member of the community
      if (!community.members.includes(req.user._id)) {
        return res
          .status(403)
          .json({ message: "You are not a member of this community" });
      }

      const post = new CommunityPost({
        community_id,
        created_by: req.user._id,
        content,
        image_url,
      });

      await post.save();

      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
