const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
