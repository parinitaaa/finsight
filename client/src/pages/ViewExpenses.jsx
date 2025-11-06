import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
  const handleUpdate = (id) => {
  navigate(`/update-expense/${id}`);
};
  

  return (
   <><div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
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
                    onClick={() => handleUpdate(exp.id)}
                    className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600"
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
   <div className="flex justify-center gap-6 mt-8">
  <Link
    to="/"
    className="bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition"
  >
    Home
  </Link>

  <Link
    to="/add-expense"
    className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
  >
    +
  </Link>
</div>

    </> 
  );
};

export default ViewExpenses;
