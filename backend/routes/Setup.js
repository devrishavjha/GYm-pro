const express = require("express");
const { verifyToken } = require("../middleware/Authmiddleware");
const Setup = require("../models/Setup");

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const ownerId = req.user.id; // from decoded JWT
    const { gymName, logo, capacity } = req.body;

    let setup = await Setup.findOne({ owner: ownerId });
    if (setup) {
      setup.gymName = gymName;
      setup.logo = logo;
      setup.capacity = capacity;
     
      await setup.save();
      return res.json({ message: "Setup updated", setup });
    }

    const newSetup = new Setup({
      owner: ownerId,
      gymName,
      logo,
      capacity,
    });

    await newSetup.save();
    res.status(201).json({ message: "Setup created", newSetup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
