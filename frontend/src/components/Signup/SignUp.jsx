import React, { useState } from "react";
import { registerUser, loginUser } from "../../api/api"; // Import loginUser for guest login
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
import Spinner from "../Spinner/Spinner"

const SignUp = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required!";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email!";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await registerUser(formData);

      // Save token and update authentication state
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);

      toast.success("Signup Successful! Redirecting...", { position: "top-right" });

      setTimeout(() => navigate("/expenses"), 2000); // Redirect after authentication
    } catch (error) {
      console.error("Signup Error:", error.response?.data?.msg || "Server error");
      setErrors({ general: error.response?.data?.msg || "Something went wrong" });
      toast.error(error.response?.data?.msg || "Signup failed!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    const guestCredentials = { email: "guest@gmail.com", password: "guest@321" };

    try {
      setLoading(true);
      const response = await loginUser(guestCredentials);
      localStorage.setItem("token", response.data.token);

      setIsAuthenticated(true);
      toast.success("Logged in as Guest!", { position: "top-right", autoClose: 3000 });

      setTimeout(() => navigate("/expenses"), 1000);
    } catch (error) {
      console.error("Guest Login Error:", error.response?.data?.msg || "Server error");
      toast.error("Guest login failed!", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        {errors.general && <p className="error">{errors.general}</p>}

        <button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Sign Up"}
        </button>
      </form>

      {/* Guest Login Button */}
      <button className="guest-login-btn" onClick={handleGuestLogin} disabled={loading}>
        {loading ? <Spinner /> : "Login as Guest"}
      </button>
    </div>
  );
};

export default SignUp;
