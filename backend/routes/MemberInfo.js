const express = require("express");
const Member = require("../models/Member");
const { verifyToken } = require("../middleware/Authmiddleware");

const router = express.Router();

// Add new member
router.post("/", verifyToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, membershipStart, membershipEnd, whatsapp, billingDate } = req.body;

    // Get the last joining number for this owner
    const lastMember = await Member.find({ owner: ownerId })
      .sort({ joiningNumber: -1 })
      .limit(1);
    const nextJoiningNumber = lastMember.length ? lastMember[0].joiningNumber + 1 : 1;

    const newMember = new Member({
      owner: ownerId,
      joiningNumber: nextJoiningNumber,
      name,
      membershipStart,
      membershipEnd,
      whatsapp,
      billingDate,
    });

    await newMember.save();
    res.status(201).json({ message: "Member added", newMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all members of logged-in owner
router.get("/", verifyToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const members = await Member.find({ owner: ownerId }).sort({ joiningNumber: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update member by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const member = await Member.findOne({ _id: req.params.id, owner: ownerId });
    if (!member) return res.status(404).json({ message: "Member not found" });

    Object.assign(member, req.body); // update fields from body
    await member.save();
    res.json({ message: "Member updated", member });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete member by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const member = await Member.findOneAndDelete({ _id: req.params.id, owner: ownerId });
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



