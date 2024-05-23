import ErrorHandler from "../utils/errorHandler.js";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import adminModel from "../models/admin/adminModel.js";
import teamModel from "../models/team/teamModel.js";
dotenv.config();
const validator = {};

validator.isAuthenticatedUser = async (req, res, next) => {
  try {
    let { token } = req.headers;
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = JWT.verify(token, process.env.SECRET_KEY);
    const user = await adminModel.findById({ _id: decodedData._id });
    req.user =  user
    if (user.role != "admin") {
      return next(new ErrorHandler(`Role: ${user.role} is not allows to access this resource`, 404));
    }
    next();
  } catch (error) {
    // Handle errors
    return next(error);
  }
};


validator.checkUserToken = async (req, res, next) => {
  try {
    let { token } = req.headers;
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = JWT.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById({ _id: decodedData._id });
    if (!user) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    req.user =  user

    next();
  } catch (error) {
    // Handle errors
    return next(error);
  }
};

validator.checkUserDetails = async (req, res, next) => {
  const { name, email, password } = req.body
  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Password is required", 400));
  }
  next();
};

validator.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is nor allows to access this resource`,
          403
        )
      );
    }
    next();
  };
};

validator.checkRole = async (req, res, next) => {
  try {
    let { token } = req.headers;
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = JWT.verify(token, process.env.SECRET_KEY);
    const user = await adminModel.findById({ _id: decodedData._id });
    req.user =  user
    if (user.role != "admin") {
      return next(new ErrorHandler(`Role: ${user.role} is not allows to access this resource`, 404));
    }
    next();
  } catch (error) {
    // Handle errors
    return next(error);
  }
};


validator.isEmailExist = async (req, res, next) => {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email: email });
    if (user) {
      return next(new ErrorHandler("Email already exist", 400));
    }
    next();
  } catch { }
};
validator.isAdminEmailExist = async (req, res, next) => {
  try {
    let { email } = req.body;
    let user = await adminModel.findOne({ email: email });
    if (user) {
      return next(new ErrorHandler("Email already exist", 400));
    }
    next();
  } catch { }
};


validator.checkVideoDetails = async (req, res, next) => {
  const { videoHash, category,areaCovered, coordinates } = req.body
  if (!videoHash) {
    return next(new ErrorHandler("Video hash is required", 400));
  }
  if (!category) {
    return next(new ErrorHandler("Video category is required", 400));
  }
  if (!areaCovered) {
    return next(new ErrorHandler("video area covered type is required", 400));
  }
  if (!coordinates.lat) {
    return next(new ErrorHandler("video upload latitude is required", 400));
  }
  if (!coordinates.lng) {
    return next(new ErrorHandler("video upload longitude is required", 400));
  }
  next();
};

export default validator;
