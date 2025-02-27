import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    onLogout(); // Call the logout function
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="navbar">
      {/* Left Side - App Name */}
      <div className="navbar-brand">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Expense Tracker
        </NavLink>
      </div>

      {/* Right Side - Navigation Links */}
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          About Us
        </NavLink>
        {!isAuthenticated ? (
          <>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Sign Up
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Login
            </NavLink>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
