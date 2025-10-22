const express = require("express");
const cors = require("cors");
const connectDB = require("./database/Db");
const supabase = require("./database/supabaseClient"); 

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const setupRoutes = require("./routes/Setup");
app.use("/api/setup", setupRoutes);
const memberRoutes = require("./routes/MemberInfo");
app.use("/api/member", memberRoutes);

const authRoutes = require("./routes/Auth");

app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend is working!"));

// Connect DB
connectDB();
app.get("/", async (req, res) => {
  try {
    // Test connection by fetching 1 record from 'sales' table
    const { data, error } = await supabase.from("sales").select("*").limit(1);
    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).send("Supabase connection failed");
    }
    res.send("Supabase connected! Data: " + JSON.stringify(data));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
app.use("/api/reports", require("./routes/reportRoutes"));

const renewRoutes = require("./routes/renew");
app.use("/api/renew", renewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


