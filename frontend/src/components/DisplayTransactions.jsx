import React from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import "./DisplayTransactions.css"; // Ensure styles are managed separately

const DisplayTransactions = ({ transactions, editTransaction, deleteTransaction }) => {
  return (
    <div className="transaction-container">
      <h3>Transactions:</h3>

      {transactions.length === 0 ? (
        <p>No transactions added yet.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((t, index) => (
            <li key={t._id} className={`transaction-item ${t.type}`}>
              <span className="transaction-details">
                [{t.type.toUpperCase()}] {t.name} - {t.category} - ₹{t.amount} - {t.date}
              </span>

              <div className="transaction-actions">
                {/* Pass `index` instead of `_id` */}
                <button className="edit-btn" onClick={() => editTransaction(index)}>
                  <CiEdit />
                </button>
                <button className="delete-btn" onClick={() => deleteTransaction(t._id)}>
                  <MdDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplayTransactions;
