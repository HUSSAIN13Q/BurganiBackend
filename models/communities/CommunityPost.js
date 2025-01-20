const mongoose = require("mongoose");

const communityPostSchema = mongoose.Schema(
  {
    community_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    image_url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
