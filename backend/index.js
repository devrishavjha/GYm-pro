const express = require("express");
const cors = require("cors");
const connectDB = require("./database/Db");
const supabase = require("./database/supabaseClient");
require("dotenv").config();

const app = express();

// ✅ CORS Setup — Allow frontend domains
app.use(
  cors({
    origin: [
      "http://localhost:5173",           // local dev
      "https://g-ym-pro.vercel.app"      // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight (OPTIONS) requests globally
app.options("/", cors());

// ✅ Optional fallback headers (good for Render)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://g-ym-pro.vercel.app");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware
app.use(express.json());

// Routes
const setupRoutes = require("./routes/Setup");
app.use("/api/setup", setupRoutes);

const memberRoutes = require("./routes/MemberInfo");
app.use("/api/member", memberRoutes);

const authRoutes = require("./routes/Auth");
app.use("/api/auth", authRoutes);

const renewRoutes = require("./routes/renew");
app.use("/api/renew", renewRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// ✅ Root test route
app.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("sales").select("*").limit(1);
    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).send("Supabase connection failed");
    }
    res.send("Backend working! Supabase connected ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Connect MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



