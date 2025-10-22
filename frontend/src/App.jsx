import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Renewals from "./pages/Renewals";
import Reports from "./pages/reports";




function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/members" element={<Members />} />
       <Route path="/renewals" element={<Renewals />} />
       <Route path="/reports" element={<Reports />} />
      
    </Routes>
  );
}

export default App;




