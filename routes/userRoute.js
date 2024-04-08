//Requiring all the necessary files and libraries
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Creating express router
const userRoute = express.Router();
//Importing userModel
const userModel = require("../models/userModel");
const {isUserAuthenticated} = require("../config/authenticate");

//Creating register route
userRoute.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Check emptyness of the incoming data
    if (!name || !email || !password) {
      return res.json({ message: "Please enter all the details" });
    }

    //Check if the user already exist or not
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({ message: "User already exist with the given emailId" });
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const user = new userModel(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return res.cookie("token", token).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});
//Creating login routes
userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check emptyness of the incoming data
    if (!email || !password) {
      return res.json({ message: "Please enter all the details" });
    }
    //Check if the user already exist or not
    const userExist = await userModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res.json({ message: "Wrong credentials" });
    }
    //Check password match
    const isPasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordMatched) {
      return res.json({ message: "Wrong credentials pass" });
    }
    const token = jwt.sign(
      { id: userExist._id },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    return res
      .cookie("token", token)
      .json({ success: true, message: "LoggedIn Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

userRoute.post("/logout", isUserAuthenticated, async (req, res) => {
  try {
    return res
      .clearCookie("token")
      .json({ success: true, message: "Loggedout Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});


module.exports = userRoute;
