const express = require("express");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");

const router = express.Router();

// ➤ Add Expense
router.post(
  "/add",
  authMiddleware,
  [
    check("name", "Name is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("amount", "Amount should be a number").isNumeric(),
    check("date", "Date is required and should be a valid date").not().isEmpty().isISO8601(),
    check("type", "Type should be 'income' or 'expense'").isIn(["income", "expense"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, amount, date, type } = req.body;

      const newExpense = new Expense({
        user: req.user.id,
        name,
        category,
        amount,
        date: new Date(date), // Ensure correct date format
        type,
      });

      const savedExpense = await newExpense.save();
      res.json(savedExpense);
    } catch (err) {
      console.error("Error adding expense:", err);
      res.status(500).send("Server error");
    }
  }
);

// ➤ Get All Expenses for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).send("Server error");
  }
});

// ➤ Update Expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    // Check if the user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Update expense details
    const { name, category, amount, date, type } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: { name, category, amount, date: new Date(date), type } },
      { new: true }
    );

    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).send("Server error");
  }
});

// ➤ Delete Expense
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     let expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).json({ msg: "Expense not found" });

//     if (expense.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "Not authorized" });
//     }

//     await Expense.findByIdAndDelete(req.params.id);
//     res.json({ msg: "Expense deleted" });
//   } catch (err) {
//     console.error("Error deleting expense:", err);
//     res.status(500).send("Server error");
//   }
// });

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received delete request for ID:", id); // Debugging

    if (!id || id.length < 12) {
      return res.status(400).json({ msg: "Invalid transaction ID" });
    }

    let expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Expense.findByIdAndDelete(id);
    res.json({ msg: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).send("Server error");
  }
});



module.exports = router;
