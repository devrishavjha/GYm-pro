import { useState, useEffect } from "react";
import API from "../api/axios";
import RenewForm from "../components/RenewForm";

const Renewals = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Renewals</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-center">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-center">No members found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p>
                Membership:{" "}
                <span className="font-medium">
                  {new Date(member.membershipStart).toLocaleDateString()} -{" "}
                  {new Date(member.membershipEnd).toLocaleDateString()}
                </span>
              </p>
              <p>WhatsApp: {member.whatsapp}</p>

              <button
                onClick={() => setSelectedMember(member)}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Renew
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedMember && (
        <RenewForm
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          fetchMembers={fetchMembers}
        />
      )}
    </div>
  );
};

export default Renewals;

