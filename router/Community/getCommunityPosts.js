const express = require("express");
const router = express.Router();
const CommunityPost = require("../../models/communities/CommunityPost");

router.get("/community_id", async (req, res) => {
  try {
    const { community_id } = req.params;

    const posts = await CommunityPost.find({ community_id })
      .populate("created_by", "name email")
      .sort({ createdAt: -1 }); // Latest posts first

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
