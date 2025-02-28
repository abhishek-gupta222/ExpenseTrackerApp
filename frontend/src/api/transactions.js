import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API_BASE_URL = `${backendUrl}/api/expenses`; // Update if needed

// ➤ Get all transactions for the logged-in user
export const fetchTransactions = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
};

// ➤ Add a new transaction
export const addTransaction = async (transaction, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding transaction", error);
    throw error;
  }
};

// ➤ Delete a transaction
export const deleteTransaction = async (id, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting transaction", error);
    throw error;
  }
};


// ➤ Update a transaction
export const updateTransaction = async (id, updatedData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating transaction", error);
    throw error;
  }
};
