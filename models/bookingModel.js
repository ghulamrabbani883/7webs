const mongoose = require("mongoose");

//Creating Schema using mongoose
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  date: { type: String, required: true },
  slot: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
});

//Creating models
const bookingModel = mongoose.model("booking", bookingSchema);
module.exports = bookingModel;
