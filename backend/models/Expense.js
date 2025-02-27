// const mongoose = require("mongoose");

// const ExpenseSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   category: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Expense", ExpenseSchema);


const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }, // Fixed date type
  type: { type: String, enum: ["income", "expense"], required: true },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
