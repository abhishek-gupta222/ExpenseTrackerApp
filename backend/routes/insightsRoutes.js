const express = require("express");
const { getExpenseInsights } = require("../utils/geminiHelper");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ msg: "Invalid expenses data" });
    }

    const insights = await getExpenseInsights(expenses);
    res.json({ insights });
  } catch (error) {
    console.error("❌ Error generating insights:", error);
    res.status(500).json({ msg: "Error generating insights" });
  }
});

module.exports = router;
