import React, { useState, useEffect } from "react";
import { getExpenseInsights } from "../api/insights";
import { addTransaction, fetchTransactions, deleteTransaction, updateTransaction } from "../api/transactions";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import FinancialBar from "./FinancialBar"; // Importing FinancialBar (Vertical Bar Chart)
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ExpenseTracker.css";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import DisplayTransactions from "./DisplayTransactions";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("expense");
  const [newTransaction, setNewTransaction] = useState({ name: "", category: "", amount: "", date: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [insights, setInsights] = useState("");
  const [showPieChart, setShowPieChart] = useState(true);

  // useEffect(() => {
  //   const loadTransactions = async () => {
  //     const data = await fetchTransactions();
  //     setTransactions(data);
  //   };
  //   loadTransactions();
  // }, []);


  useEffect(() => {
    const loadTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error! Please log in.");
        return;
      }
      const data = await fetchTransactions(token);
      setTransactions(data);
    };
    loadTransactions();
  }, [transactions]);  // Dependency array ensures it re-fetches on updates
  


  const categories = {
    income: ["Salary", "Freelancing", "Investments", "Other"],
    expense: ["Food", "Transport", "Rent", "Entertainment", "Other"],
  };

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const setCurrentDate = () => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setNewTransaction({ ...newTransaction, date: today });
  };

  // const handleTransaction = async () => {
  //   if (!newTransaction.name || !newTransaction.category || !newTransaction.amount || !newTransaction.date) {
  //     toast.error("All fields are required!", { position: "top-right", autoClose: 3000 });
  //     return;
  //   }

  //   if (editIndex !== null) {
  //     await updateTransaction(transactions[editIndex]._id, { ...newTransaction, type });
  //     setEditIndex(null);
  //     toast.success("Transaction updated successfully!", { position: "top-right", autoClose: 3000 });
  //   } else {
  //     await addTransaction({ ...newTransaction, type });
  //     toast.success("Transaction added successfully!", { position: "top-right", autoClose: 3000 });
  //   }

  //   const data = await fetchTransactions();
  //   setTransactions(data);
  //   setNewTransaction({ name: "", category: "", amount: "", date: "" });
  // };
  const handleTransaction = async () => {
    if (!newTransaction.name || !newTransaction.category || !newTransaction.amount || !newTransaction.date) {
      toast.error("All fields are required!", { position: "top-right", autoClose: 3000 });
      return;
    }
  
    const token = localStorage.getItem("token"); // Ensure the user is logged in and token is available
    if (!token) {
      toast.error("Authentication error! Please log in.", { position: "top-right", autoClose: 3000 });
      return;
    }
  
    try {
      if (editIndex !== null) {
        await updateTransaction(transactions[editIndex]._id, { ...newTransaction, type }, token);
        toast.success("Transaction updated successfully!", { position: "top-right", autoClose: 3000 });
        setEditIndex(null);
      } else {
        await addTransaction({ ...newTransaction, type }, token);
        toast.success("Transaction added successfully!", { position: "top-right", autoClose: 3000 });
      }
  
      // Fetch updated transactions from backend
      const data = await fetchTransactions(token);
      setTransactions(data);
      setNewTransaction({ name: "", category: "", amount: "", date: "" }); // Reset form fields
    } catch (error) {
      toast.error("Error processing transaction!", { position: "top-right", autoClose: 3000 });
      console.error("Transaction Error:", error);
    }
  };
  

  // const deleteTransactionHandler = async (id) => {
  //   await deleteTransaction(id);
  //   setTransactions(transactions.filter((t) => t._id !== id));
  //   toast.success("Transaction deleted successfully!", { position: "top-right", autoClose: 3000 });
  // };

  const deleteTransactionHandler = async (id) => {
    console.log("Deleting transaction ID:", id); // Debugging
  
    if (!id || id.length < 12) { // Check if ID is valid
      toast.error("Invalid transaction ID!", { position: "top-right", autoClose: 3000 });
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error! Please log in.", { position: "top-right", autoClose: 3000 });
        return;
      }
  
      await deleteTransaction(id, token);
      setTransactions(transactions.filter((t) => t._id !== id));
      toast.success("Transaction deleted successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction!", { position: "top-right", autoClose: 3000 });
    }
  };
  
  
  

  // const editTransaction = (index) => {
  //   const transactionToEdit = transactions[index];
  //   setNewTransaction(transactionToEdit);
  //   setType(transactionToEdit.type);
  //   setEditIndex(index);
  // };

  const editTransaction = (index) => {
    if (index < 0 || index >= transactions.length) {
      console.error("editTransaction: Invalid index", index);
      return;
    }
  
    const transactionToEdit = transactions[index];
  
    setNewTransaction(transactionToEdit);
    setType(transactionToEdit.type);
    setEditIndex(index); // Store the index
  };
  

  
  

  const fetchInsights = async () => {
    if (transactions.length === 0) {
      toast.error("Please add transactions first!", { position: "top-right", autoClose: 3000 });
      return;
    }
    const response = await getExpenseInsights(transactions);
    setInsights(response);
  };

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome - totalExpenses;

  const chartData = [
    { name: "Income", value: totalIncome, color: "#4CAF50" },
    { name: "Expenses", value: totalExpenses, color: "#F44336" },
    { name: "Savings", value: savings > 0 ? savings : 0, color: "#2196F3" },
  ];

  return (
    <div className="container">
      <ToastContainer />

      <div className="add-expense">
        <h2>Add Transaction</h2>

        <div className="toggle">
          <button onClick={() => setType("income")} style={{ fontWeight: type === "income" ? "bold" : "normal" }}>
            Income
          </button>
          <button onClick={() => setType("expense")} style={{ fontWeight: type === "expense" ? "bold" : "normal" }}>
            Expense
          </button>
        </div>

        <div className="input-fields">
          <input type="text" name="name" placeholder="Transaction Name" value={newTransaction.name} onChange={handleInputChange} />

          <select name="category" value={newTransaction.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            {categories[type].map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* <input type="number" name="amount" placeholder="Amount" value={newTransaction.amount} onChange={handleInputChange} /> */}
          <input type="number" name="amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })} />


          <div className="date-input-container">
            <input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
            <button onClick={setCurrentDate} className="date-btn">📅 Today</button>
          </div>

          <button onClick={handleTransaction}>{editIndex !== null ? "Update" : "Add"} {type}</button>
        </div>

        {/* Transactions Display Component */}
        <div className="display-transactions">
          <DisplayTransactions
            transactions={transactions}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransactionHandler}
          />
        </div>

        
      </div>

      <div className="pie-charts">
        <div className="chart-toggle">
          <button onClick={() => setShowPieChart(true)} className={showPieChart ? "active" : ""}>
            PieChart
          </button>
          <button onClick={() => setShowPieChart(false)} className={!showPieChart ? "active" : ""}>
            BarChart
          </button>
        </div>

        <div className="charts">
          {showPieChart ? (
            <div className="pieChart">
              <h3>Financial Summary</h3>
              <PieChart width={330} height={330}>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <FinancialBar className="FinancialBar" transactions={transactions} />
          )}
        </div>
        <button className="insights-btn" onClick={fetchInsights}>Get Insights</button>
        {insights && <p><strong>Insights:</strong> {insights}</p>}
      </div>
      
    </div>
  );
};

export default ExpenseTracker;
