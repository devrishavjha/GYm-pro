const express = require("express");
const { verifyToken } = require("../middleware/Authmiddleware");
const Member = require("../models/Member");
const supabase = require("../database/supabaseClient");

const router = express.Router();

// POST /api/renew/:memberId
router.post("/:memberId", verifyToken, async (req, res) => {
  try {
    const { amount, extendMonths } = req.body; // optional: months to extend
    const { memberId } = req.params;

    if (!amount) return res.status(400).json({ message: "Amount is required" });

    // Find member
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Update membershipEnd (default +12 months if extendMonths not provided)
    const currentEnd = member.membershipEnd || new Date();
    const newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + (extendMonths || 12));
    member.membershipEnd = newEnd;
    await member.save();

    // Record payment in Supabase
    const paymentRecord = {
      member_id: member._id.toString(), // ensure string for Supabase UUID
      amount: parseFloat(amount),
      payment_date: new Date(),
    };

    const { error } = await supabase.from("sales").insert([paymentRecord]);
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ message: "Payment record failed", error });
    }

    res.json({
      message: "Payment recorded & membership updated successfully",
      member,
      sale: paymentRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;


