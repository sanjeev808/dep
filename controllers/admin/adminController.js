import ErrorHandler from "../../utils/errorHandler.js";
import adminModel from "../../models/admin/adminModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import sendToken from "../../utils/sendToken.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
// import ApiFeatures from "../utils/apiFeatures.js";

const adminController = {};
// admin register -------------------------
adminController.adminRegister = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let userData = {
      name: name,
      email: email,
      password: password,
      avatar: {
        url: avatar,
      },
    };  
    const user = await adminModel.create(userData);
     let message = "register successfully";
     sendToken(user, 201, res, message);
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

// user login -----------------------
adminController.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    let user = await adminModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }

    let passwordCompare = await user.comparepassword(password);
    if (!passwordCompare) {
      return next(new ErrorHandler("Enter valid email & password", 400));
    }
    let message = "Login Successfully";
    sendToken(user, 200, res, message);
  } catch (error) {
    res.status(500).json({
      newUser: error,
    });
  }
};


adminController.adminProfile = async (req, res, next) => {
  try {
      const { id } = req.user;
    const user = await adminModel.findById({_id:id});
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch {}
};




adminController.adminEditProfile = async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    let userUpdated = await adminModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      data: userUpdated,
    });
  } catch (error) {}
};

// user logout --------------------
adminController.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
};


export default adminController;
