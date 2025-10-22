import { useState } from "react";
import API from "../api/axios";

const RenewForm = ({ member, fetchMembers, closeForm }) => {
  const [amount, setAmount] = useState("");
  const [extendMonths, setExtendMonths] = useState(1); // default 1 month
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || extendMonths <= 0) {
      setError("Please enter valid amount and months to extend");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/renew/${member._id}`, {
        amount,
        extendMonths,
      });

      setSuccess("Payment recorded & membership updated successfully!");
      setAmount("");
      setExtendMonths(1);

      fetchMembers(); // refresh members list
      if (closeForm) closeForm(); // close modal if passed
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        Renew Membership: {member.name}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter payment amount"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Extend Membership (Months)</label>
          <input
            type="number"
            min="1"
            value={extendMonths}
            onChange={(e) => setExtendMonths(parseInt(e.target.value))}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Processing..." : "Renew Membership"}
        </button>
      </form>
    </div>
  );
};

export default RenewForm;
