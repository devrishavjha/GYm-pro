// routes/reportRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/Authmiddleware");
const supabase = require("../database/supabaseClient");
const Member = require("../models/Member");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Fetch members of this owner
    const members = await Member.find({ owner: ownerId }, "_id");
    const memberIds = members.map((m) => m._id.toString());

    // Fetch sales only for these members
    const { data, error } = await supabase
      .from("sales")
      .select("amount, payment_date, member_id");

    if (error) throw error;

    // Filter only sales of the logged-in user's members
    const filteredSales = data.filter((s) => memberIds.includes(s.member_id));

    // Group by month
    const monthlyTotals = {};
    filteredSales.forEach((s) => {
      const month = new Date(s.payment_date)
        .toLocaleString("default", { month: "short", year: "numeric" });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + s.amount;
    });

    // Insights
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
    const totalRenewals = filteredSales.length;
    const avgRevenue = totalRenewals ? totalRevenue / totalRenewals : 0;
    const highestMonth = Object.entries(monthlyTotals).sort((a, b) => b[1] - a[1])[0];

    res.json({
      monthlyTotals,
      totalRevenue,
      totalRenewals,
      avgRevenue,
      highestMonth: highestMonth ? highestMonth[0] : "N/A",
    });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

