import { useEffect, useState } from "react";
import API from "../api/axios";
import MemberForm from "../components/MemberForm";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const deleteMember = async (id) => {
    try {
      await API.delete(`/member/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete member");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Gym Members</h1>

      {/* Add Member Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        + Add Member
      </button>

      {/* Member Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
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
        <p className="mt-4 text-gray-500">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="mt-4 text-gray-500">No members found.</p>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {members.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition relative"
            >
              <h2 className="text-xl font-semibold text-gray-800">{m.name}</h2>
              <p className="text-gray-500">
                <span className="font-medium">Membership:</span>{" "}
                {new Date(m.membershipStart).toLocaleDateString()} -{" "}
                {new Date(m.membershipEnd).toLocaleDateString()}
              </p>
              <p className="text-gray-500">
                <span className="font-medium">WhatsApp:</span> {m.whatsapp}
              </p>
              <button
                onClick={() => setDeleteId(m._id)}
                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this member?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => deleteMember(deleteId)}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
