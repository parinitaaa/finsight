import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/finance", {
        withCredentials: true,
      });
      setExpenses(res.data);
    } catch (err) {
      setMessage("Error fetching expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/finance/${id}`, {
        withCredentials: true,
      });
      setExpenses(expenses.filter((e) => e.id !== id));
      setMessage("Expense deleted successfully");
    } catch (err) {
      setMessage("Error deleting expense");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Expenses</h2>
      {message && <p className="text-blue-600 mb-4">{message}</p>}

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses added yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Payment</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="border p-2">{exp.title}</td>
                <td className="border p-2">₹{exp.amount}</td>
                <td className="border p-2">{exp.category}</td>
                <td className="border p-2">{exp.payment_method}</td>
                <td className="border p-2">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewExpenses;
