const { model, Schema } = require("mongoose");

const leaveBalanceSchema = Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    annual_entitlement: { type: Number, required: true }, // Total annual leave days
    annual_used: { type: Number, default: 0 }, // Annual leave days used
    sick_entitlement: { type: Number, required: true }, // Total sick leave days
    sick_used: { type: Number, default: 0 }, // Sick leave days used
  },
  { timestamps: true }
);

module.exports = model("LeaveBalance", leaveBalanceSchema);
