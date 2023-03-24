const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  balances: [
    {
      year: { type: String, required: [true, "Please enter the year"] },
      balance: {
        type: Number,
        required: [true, "Please enter the balance"],
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
