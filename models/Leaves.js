const { model, Schema } = require("mongoose");

const leaveSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["Sick", "Annual"], required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    manager_id: { type: Schema.Types.ObjectId, ref: "User" },
    hr_id: { type: Schema.Types.ObjectId, ref: "User" },
    medical_report: String,
  },
  { timestamps: true }
);

module.exports = model("Leave", leaveSchema);
