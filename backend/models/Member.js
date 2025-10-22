const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  joiningNumber: { type: Number, required: true },
  name: { type: String, required: true },
  membershipStart: { type: Date, required: true },
  membershipEnd: { type: Date, required: true },
  whatsapp: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  billingDate: { type: Date, required: true }
});



module.exports = mongoose.model("Member", memberSchema);