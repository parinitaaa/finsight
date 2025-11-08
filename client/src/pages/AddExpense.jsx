import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddExpense = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    payment_method: "",
    date: "",
});

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/finance", formData, {
        withCredentials: true,
      });
      console.log("✅ Response from backend:", res);
      setMessage(res.data.msg);
      setFormData({
        title: "",
        amount: "",
        category: "",
        description: "",
        payment_method: "",
        date: "",
      });
      // Optionally redirect to ViewExpenses page
      navigate("/view-expenses");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error adding expense");
    }
  };


  return (
    <>
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Expense</h2>
      {message && <p className="text-blue-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-3 border rounded-md"
        />
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount (₹)"
          required
          className="w-full p-3 border rounded-md"
        />
        <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
  className="w-full p-3 border rounded-md"
>
  <option value="">Select Category</option>
  <option value="food">Food</option>
  <option value="shopping">Shopping</option>
  <option value="bills">Bills</option>
  <option value="travel">Travel</option>
  <option value="rent">Rent</option>
  <option value="other">Other</option>
</select>
        <input
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          placeholder="Payment Method (Cash, UPI, etc.)"
          className="w-full p-3 border rounded-md"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded-md"
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Add Expense
        </button>
      </form>
    </div>
    <div className="flex justify-center gap-6 mt-8">
  <Link
    to="/"
    className="bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition"
  >
    Home
  </Link>

  <Link
    to="/view-expenses"
    className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
  >
    👀 view all expenses
  </Link>
</div>
    </>
  );
};

export default AddExpense;