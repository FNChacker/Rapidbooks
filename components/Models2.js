const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true],
  },
  customerId: {
    type: String,
    required: [true],
  },
  accountArray: [
    {
      accountId: {
        type: String,
        required: [true],
      },
      amount: {
        type: Number,
        required: [true],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true],
  },
  invoiceNumber: {
    type: String,
    required: [true],
  },
  year: {
    type: String,
    required: [true],
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
