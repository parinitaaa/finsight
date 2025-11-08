import React from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from "recharts";
import { useLocation, Link, useNavigate } from "react-router-dom";

const FinanceResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rawData, categoryData, dateData, total } = location.state || {};

  if (!rawData) {
    return (
      <div className="text-center mt-10">
        <p>No data to display. Please upload a file first.</p>
        <Link
          to="/finance-analysis"
          className="text-blue-600 underline mt-4 block"
        >
          Go back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Finance Analysis Results</h2>

      <p className="text-xl font-semibold mb-6">
        Total Spent: <span className="text-green-600">₹{total}</span>
      </p>

      {/* Category Bar Chart */}
      {categoryData.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-8 mb-4">Category Breakdown</h3>
          <BarChart width={600} height={300} data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Amount" fill="#8884d8" />
          </BarChart>
        </>
      )}

      {/* Date Line Chart */}
      {dateData.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-12 mb-4">Expense Trend Over Time</h3>
          <LineChart width={600} height={300} data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Amount" stroke="#82ca9d" />
          </LineChart>
        </>
      )}

      {/* Category Pie Chart */}
      {categoryData.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-12 mb-4">Category Distribution</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={categoryData}
              dataKey="Amount"
              nameKey="Category"
              cx="50%"
              cy="50%"
              outerRadius={130}
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={index} fill={`hsl(${index * 40}, 70%, 60%)`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </>
      )}

      {/* Raw Table */}
      {rawData.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-12 mb-4">Raw Excel Data</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(rawData[0]).map((key) => (
                  <th key={key} className="border p-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rawData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border p-2">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default FinanceResults;
