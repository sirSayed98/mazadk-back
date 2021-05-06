const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please add a name for company"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  describtion: {
    type: String,
    maxlength: [200, "Please add describtion for company"],
  },
  phone: {
    type: String,
    maxlength: [11, "Phone number can not be longer than 11 characters"],
    unique: true,
  },
  accepted: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", RequestSchema);
