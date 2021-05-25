const mongoose = require("mongoose");

const MazadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [30, "Please add a name for Mazad"],
    },
    describtion: {
      type: String,
      required: true,
      maxlength: [50, "Please add describtion for Mazad"],
    },
    start_price: {
      type: Number,
      required: true,
    },
    market_price: {
      type: Number,
      required: true,
    },
    expected_price: {
      type: Number,
      required: true,
    },
    current_price: {
      type: Number,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    interested_subscribers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    subscribers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    merchant: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Mazad must belong to Merchant"],
    },
    winner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    photo:{
        type: String,
        default: "/uploads/mazad/default.png",
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Mazad", MazadSchema);
