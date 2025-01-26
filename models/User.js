const { model, Schema } = require("mongoose");

const PasswordManager = require("../helper/PasswordManager");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Employee", "Manager", "HR"], required: true },
    location: String,
    title: String,
    department: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

module.exports = model("User", UserSchema);
