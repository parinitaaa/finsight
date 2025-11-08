import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
const [filterCategory, setFilterCategory] = useState("");

const [filterPayment, setFilterPayment] = useState("");
const [sortOption, setSortOption] = useState("");


  const fetchExpenses = async () => { /* function that fetches expenses from your backend API*/
    try {
      const res = await axios.get("http://localhost:5000/api/finance", {
        withCredentials: true, /* tells Axios to include cookies in the request*/
      });
      setExpenses(res.data); /* This stores your fetched expense list into the component state.*/
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
      
<div className="flex flex-col md:flex-row gap-4 mb-6  ">

  {/* ✅ Search */}
  <input
    type="text"
    placeholder="Search by title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded w-full"
  />

  {/* ✅ Category Filter */}
  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="border p-2 rounded w-full md:w-40"
  >
    <option value="">All Categories</option>
    <option value="food">Food</option>
    <option value="shopping">Shopping</option>
    <option value="bills">Bills</option>
    <option value="travel">Travel</option>
    <option value="rent">Rent</option>
    <option value="other">Other</option>
  
  </select>


  {/* ✅ Payment Filter */}
  <select
    value={filterPayment}
    onChange={(e) => setFilterPayment(e.target.value)}
    className="border p-2 rounded w-full md:w-40"
  >
    <option value="">All Payments</option>
    <option value="cash">Cash</option>
    <option value="upi">UPI</option>
    <option value="card">Card</option>
    <option value="netbanking">Net Banking</option>
  </select>

  {/* ✅ Sorting */}
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="border p-2 rounded w-full md:w-40"
  >
    <option value="">Sort By</option>
    <option value="amountLowHigh">Amount: Low → High</option>
    <option value="amountHighLow">Amount: High → Low</option>
    <option value="dateNewOld">Date: Newest → Oldest</option>
    <option value="dateOldNew">Date: Oldest → Newest</option>
  </select>

</div>




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
                {expenses
  // ✅ Search
  .filter((z) =>
    z.title.toLowerCase().includes(search.toLowerCase())
  )

  // ✅ Category Filter
  .filter((exp) =>
    filterCategory
      ? exp.category.toLowerCase() === filterCategory.toLowerCase()
      : true
  )

  // ✅ Payment Filter
  .filter((exp) =>
    filterPayment
      ? exp.payment_method.toLowerCase() === filterPayment.toLowerCase()
      : true
  )

  // ✅ Sorting
  .sort((a, b) => {
    switch (sortOption) {
      case "amountLowHigh":
        return a.amount - b.amount;
      case "amountHighLow":
        return b.amount - a.amount;
      case "dateNewOld":
        return new Date(b.date) - new Date(a.date);
      case "dateOldNew":
        return new Date(a.date) - new Date(b.date);
      default:
        return 0;
    }
  })

  // ✅ Final mapping
  .map((exp) => (
    <tr key={exp.id}>
      <td className="border p-2">{exp.title}</td>
      <td className="border p-2">₹{exp.amount}</td>
      <td className="border p-2">{exp.category}</td>
      <td className="border p-2">{exp.payment_method}</td>
      <td className="border p-2">{new Date(exp.date).toLocaleDateString()}</td>
      <td className="border p-2 text-center">
        <button
          onClick={() => handleUpdate(exp.id)}
          className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 cursor-pointer"
        >
          Update
        </button>

        <button
          onClick={() => handleDelete(exp.id)}
          className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 ml-3 cursor-pointer"
        >
          Delete
        </button>
      </td>
    </tr>
  ))
}

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
    + Add an Expense
  </Link>
</div>

    </> 
  );
};

export default ViewExpenses;
