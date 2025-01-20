const { model, Schema } = require("mongoose");

const communitySchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = model("Community", communitySchema);
