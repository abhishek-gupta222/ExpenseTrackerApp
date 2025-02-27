import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FinancialBar = ({ transactions }) => {
  // Group transactions by date
  const groupedData = transactions.reduce((acc, transaction) => {
    const { date, amount, type } = transaction;
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }
    acc[date][type] += amount;
    return acc;
  }, {});

  // Convert object into an array for Recharts
  const chartData = Object.values(groupedData);

  return (
    <div className="graph-container">
      <h3>Financial Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#4CAF50" barSize={40} />
          <Bar dataKey="expense" fill="#F44336" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialBar;
