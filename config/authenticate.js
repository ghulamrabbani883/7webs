const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const isUserAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next("Please login to access the data");
    }
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await userModel.findById(verify.id);
    next();
  } catch (error) {
    return next(error);
  }
};
const isSalonAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next("Please login to access the data");
    }
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(verify.id);
    if (!user.isSalonStaff) {
      return next(
        "You are not authorize to access this resource, please contact admin"
      );
    }
    req.user = user
    next();
  } catch (error) {
    return next(error);
  }

};

module.exports = { isUserAuthenticated, isSalonAuthenticated };
