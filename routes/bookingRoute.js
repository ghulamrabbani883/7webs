//Requiring all the necessary files and libraries
const express = require("express");
//Creating express router
const bookingRoute = express.Router();
//Importing userModel
const bookingModel = require("../models/bookingModel");
const availabilityModel = require("../models/availabilitySchema");
const { isUserAuthenticated } = require("../config/authenticate");

bookingRoute.post("/bookings", isUserAuthenticated, async (req, res) => {
  try {
    const { date, slot } = req.body;
    const { _id: userId } = req.user;
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
    // Validate request body
    if (!userId || !date || !slot || !slot.start || !slot.end) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Find the slots for the given date
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

    // Filter all the slots that matches booking slot
    const matchedSlot = avaialableSlots.filter(
      (inSlot) => inSlot.start === slot.start && inSlot.end === slot.end
    );

    //Finding the first slot whose maxCapacity is less than 5
    const index = matchedSlot.findIndex((slot) => slot.maxCapacity < 5);

    //  Update the maxCapacity of the first slot found, if any
    if (index !== -1) {
      matchedSlot[index].maxCapacity += 1;

      try {
        //Now save the bookings to booking Document
        const bookingResponse = await bookingModel.create(req.body);

        // Save the changes in the availability model
        await availabilityModel.findOneAndUpdate(
          { "availability.day": dayString },
          { "availability.slots": matchedSlot },
          { new: true }
        );
        return res.status(200).json({
          message: "Your booking has been done",
          bookingResponse,
        });
      } catch (error) {
        return res.status(500).json({ message: "Error updating availability" });
      }
    } else {
      return res.status(400).json({
        message: "Slot has reached maximum capacity",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

bookingRoute.get("/bookings", async (req, res) => {
  try {
    const bookings = await bookingModel.find();
    return res.json({ bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});
module.exports = bookingRoute;
