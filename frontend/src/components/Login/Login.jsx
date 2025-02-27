import React, { useState } from "react";
import { loginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import Spinner from "../Spinner/Spinner"

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
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
      const response = await loginUser(formData);
      localStorage.setItem("token", response.data.token);

      setIsAuthenticated(true); // Update authentication state

      toast.success("Login Successful!", { position: "top-right", autoClose: 3000 });

      setTimeout(() => navigate("/expenses"), 1000); // Navigate after toast
    } catch (error) {
      console.error("Login Error:", error.response?.data?.msg || "Server error");
      toast.error(error.response?.data?.msg || "Invalid credentials", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    const guestCredentials = { email: "guest@gmail.com", password: "guest@321" };
    setFormData(guestCredentials);

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
    <div className="login-container">
      <ToastContainer />
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
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

        <button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </button>
      </form>

      {/* Guest Login Button */}
      <button className="guest-login-btn" onClick={handleGuestLogin} disabled={loading}>
        {loading ? <Spinner /> : "Login as Guest"}
      </button>

      {/* Add link to Signup Page */}
      <p className="signup-link">
        Not registered? <span onClick={() => navigate("/signup")}>Create an account</span>
      </p>
    </div>
  );
};

export default Login;
