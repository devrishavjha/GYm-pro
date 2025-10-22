import { useEffect, useState } from "react";
import API from "../api/axios";
import MemberForm from "../components/MemberForm";
import { FiTrash2, FiPhone } from "react-icons/fi";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/member", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const deleteMember = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await API.delete(`/member/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete member");
    }
  };

  const isActive = (endDate) => new Date(endDate) >= new Date();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Members</h1>

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        + Add Member
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <MemberForm
              token={token}
              fetchMembers={fetchMembers}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 my-4">{error}</p>}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-gray-600">No members found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-xl p-5 shadow hover:shadow-xl transition relative"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{m.name}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive(m.membershipEnd)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isActive(m.membershipEnd) ? "Active" : "Expired"}
                </span>
              </div>

              <div className="mt-2 text-gray-600 text-sm space-y-1">
                <p>
                  Membership:{" "}
                  {new Date(m.membershipStart).toLocaleDateString()} -{" "}
                  {new Date(m.membershipEnd).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-1">
                  <FiPhone className="inline text-blue-500" /> {m.whatsapp}
                </p>
                <p>Billing: {new Date(m.billingDate).toLocaleDateString()}</p>
              </div>

              <button
                onClick={() => deleteMember(m._id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;

