const express = require("express");
const router = express.Router();
const Community = require("../../models/communities/Community");

router.post("/:community_id/apply", async (req, res) => {
  try {
    const { community_id } = req.params;
    const user_id = req.user.id;
    console.log(req.params);
    const community = await Community.findById(community_id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.members.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this community" });
    }

    community.members.push(req.user._id);
    await community.save();

    res
      .status(200)
      .json({ message: "Joined community successfully", community });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
