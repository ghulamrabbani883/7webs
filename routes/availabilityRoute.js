//Requiring all the necessary files and libraries
const express = require("express");
const { isSalonAuthenticated } = require("../config/authenticate");
const availabilityModel = require("../models/availabilitySchema");
//Creating express router
const availabiltyRoute = express.Router();

availabiltyRoute.post(
  "/availability",
  isSalonAuthenticated,
  async (req, res) => {
    try {
      const { availability } = req.body;
      // Validate request body
      if (!availability || !Array.isArray(availability)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      // Update or create the schedule document
      // let schedule = await availabilityModel.findOne({});
      // if (!schedule) {
      const schedule = new availabilityModel({ user: req.user, availability });
      // }
      const savedAvailability = await schedule.save();
      return res
        .status(201)
        .json({ message: "Availability set successfully", savedAvailability });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);
availabiltyRoute.get("/available-slots/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const dateString = new Date(date);
    // Get the day as a number (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayNumber = dateString.getDay();
    // Convert the day number to a string representation
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayString = daysOfWeek[dayNumber];

    // Find all the avaialable slots
    const avaialableSlots = await availabilityModel.aggregate([
      // Match documents with availability for the given day
      {
        $match: {
          "availability.day": dayString,
        },
      },
      // Unwind the availability array to work with individual availability documents
      {
        $unwind: "$availability",
      },
      // Filter to keep only the availability for the given day
      {
        $match: {
          "availability.day": dayString,
        },
      },
      // Project to reshape the document and keep only the slots for the given day
      {
        $project: {
          slots: "$availability.slots",
        },
      },
    ]);

    return res.status(201).json({ slots: avaialableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = availabiltyRoute;
