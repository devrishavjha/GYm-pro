// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaMoneyCheckAlt, FaChartLine } from "react-icons/fa";

const cards = [
  {
    title: "Members",
    description: "View, add, update, or delete members",
    icon: <FaUsers size={30} className="text-blue-500" />,
    link: "/members",
  },
  {
    title: "Renewals",
    description: "Record payments and renew memberships",
    icon: <FaMoneyCheckAlt size={30} className="text-green-500" />,
    link: "/renewals",
  },
  {
    title: "Reports",
    description: "View revenue and member statistics",
    icon: <FaChartLine size={30} className="text-purple-500" />,
    link: "/reports",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");

    if (!token) navigate("/");
    else setUsername(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">Gym Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-3xl font-semibold mb-2 text-gray-700">
          Welcome, {username}!
        </h2>
        <p className="mb-8 text-gray-500">
          Manage your gym efficiently with quick access to everything.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer flex flex-col justify-between hover:shadow-2xl transition"
              onClick={() => navigate(card.link)}
            >
              <div className="flex items-center mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-500">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
