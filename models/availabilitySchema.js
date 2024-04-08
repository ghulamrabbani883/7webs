const mongoose = require("mongoose");

// Define schedule schema
const availabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  availability: [
    {
      day: { type: String, required: true },
      slots: [
        {
          start: { type: String, required: true },
          end: { type: String, required: true },
          maxCapacity: { type: Number, default: 0 },
        },
      ],
    },
  ],
});

// Create mongoose model
const availabilityModel = mongoose.model("availability", availabilitySchema);

module.exports = availabilityModel;
