import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinanceAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // key must match FastAPI endpoint

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:8000/analyze-excel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Navigate to results page with data
      navigate("/finance-results", {
        state: {
          rawData: res.data.raw || [],
          categoryData: res.data.category_summary || [],
          dateData: res.data.date_summary || [],
          total: res.data.total || 0,
        },
      });

    } catch (err) {
      console.error(err);
      setError("Failed to analyze file. Please check the file format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Finance Excel Analysis</h2>

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFile}
        className="mb-4 p-2 border rounded w-full"
      />

      {loading && <p className="text-gray-600 mt-2">Analyzing file...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FinanceAnalysis;
