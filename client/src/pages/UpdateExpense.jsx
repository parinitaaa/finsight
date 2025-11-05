import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    payment_method: "",
    date: "",
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/finance/${id}`, {
          withCredentials: true,
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching expense:", err);
      }
    };
    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/finance/${id}`, formData, {
        withCredentials: true,
      });
      alert("Expense updated successfully!");
      navigate("/view-expenses");
    } catch (err) {
      alert("Error updating expense");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="payment_method" placeholder="Payment Method" value={formData.payment_method} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="date" name="date" value={formData.date?.slice(0,10)} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Update Expense</button>
      </form>
    </div>
  );
};

export default UpdateExpense;
