// import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5000" });

// export default API;

import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({ baseURL: `${backendUrl}` });

// Automatically attach JWT token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Authentication APIs
export const registerUser = (userData) => API.post("/api/auth/register", userData);
export const loginUser = (userData) => API.post("/api/auth/login", userData);

export default API;

