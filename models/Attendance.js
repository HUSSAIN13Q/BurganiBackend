const { model, Schema } = require("mongoose");

const attendanceSchema = Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    check_in_time: Date,
    check_out_time: Date,
    date: { type: String, required: true },
    work_hours: Number,
    late_hours: Number,
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = model("Attendance", attendanceSchema);
