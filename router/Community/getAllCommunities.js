const express = require("express");
const router = express.Router();
const Community = require("../../models/communities/Community");

router.get("/", async (req, res) => {
  try {
    const communities = await Community.find({})
      .populate("created_by", "name email")
      .select("title description members created_by createdAt")
      .sort({ createdAt: -1 }); // Sort by latest communities

    res.status(200).json({ communities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
