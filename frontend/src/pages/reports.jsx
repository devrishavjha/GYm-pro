import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("https://gym-pro-ddxr.onrender.com/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transform object into array for chart
        const monthlyData = Object.entries(res.data.monthlyTotals || {}).map(
          ([month, total]) => ({ month, total })
        );

        setMonthlyIncome(monthlyData);
        setInsights({
          totalRevenue: res.data.totalRevenue || 0,
          totalRenewals: res.data.totalRenewals || 0,
          avgRevenue: res.data.avgRevenue?.toFixed(2) || 0,
          highestMonth: res.data.highestMonth || "N/A",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Gym Reports</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Monthly Income Chart */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Monthly Income</h2>
            {monthlyIncome.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyIncome}>
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No sales data</p>
            )}
          </div>

          {/* Total Revenue */}
          <div className="bg-green-700 rounded-lg p-4 shadow-md flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold">{insights.totalRevenue}</p>
          </div>

          {/* Total Renewals */}
          <div className="bg-blue-700 rounded-lg p-4 shadow-md flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">Total Renewals</h2>
            <p className="text-3xl font-bold">{insights.totalRenewals}</p>
          </div>

          {/* Average Revenue */}
          <div className="bg-purple-700 rounded-lg p-4 shadow-md flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">Average Revenue</h2>
            <p className="text-3xl font-bold">{insights.avgRevenue}</p>
          </div>

          {/* Highest Month */}
          <div className="bg-yellow-600 rounded-lg p-4 shadow-md flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">Highest Month</h2>
            <p className="text-3xl font-bold">{insights.highestMonth}</p>
          </div>
        </div>
      )}
    </div>
  );
}

