import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const ViewOneExpense = () => {
  const { id } = useParams();          // get ID from URL
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch the selected expense
  const fetchExpense = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/finance/${id}`, {
        withCredentials: true,
      });
      setExpense(res.data);
    } catch (err) {
      setMessage("Error fetching expense details");
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  if (!expense) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Expense Details
      </h2>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <div className="space-y-3 text-lg">
        <p><strong>Title:</strong> {expense.title}</p>
        <p><strong>Amount:</strong> ₹{expense.amount}</p>
        <p><strong>Category:</strong> {expense.category}</p>
        <p><strong>Payment Method:</strong> {expense.payment_method}</p>
        <p><strong>Description:</strong> {expense.description}</p>
        <p><strong>Date:</strong> {new Date(expense.date).toLocaleString()}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate(`/update-expense/${expense.id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Update
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          Back
        </button>
      </div>
    </div> 
  );
};

export default ViewOneExpense;
