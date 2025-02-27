const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");



dotenv.config();
const app = express();

// Middleware
app.use(express.json());
// app.use(cors());


app.use(
  cors({
    origin: "https://expense-tracker-app-two-rose.vercel.app"
  })
);


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/insights", require("./routes/insightsRoutes"));


app.get("/", (req, res) => {
  res.send("Expense Tracker API is running...");
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
