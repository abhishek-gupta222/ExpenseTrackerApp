import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Create this file for styling

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
        <br></br>
      <h1>Welcome to Expense Tracker</h1>
      <p>Manage your expenses efficiently and effortlessly.</p>
      
      {/* Button to navigate to login page */}
      <button className="login-btn" onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
};

export default Home;
