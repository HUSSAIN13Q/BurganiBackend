const { model, Schema } = require("mongoose");

const workshopSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        applied_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Workshop", workshopSchema);
