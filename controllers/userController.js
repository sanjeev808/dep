import ErrorHandler from "../utils/errorHandler.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
import getProvider from "../utils/provider.js";
import moment from "moment"
dotenv.config();
// import ApiFeatures from "../utils/apiFeatures.js";

const userController = {};
// admin register -------------------------
userController.register = async (req, res) => {
  try {
    const { name, email, password, mobileNo, DOB, gender } = req.body;
    let userData = {
      name: name,
      email: email,
      password: password,
      mobileNo: mobileNo,
      DOB: DOB,
      gender: gender
    };
    let contract = await getProvider()
    const user = await userModel.create(userData);
    const txHash = await contract.userRegistration(user.id, name, email, mobileNo);
    if (txHash.hash) {
      let message = "register successfully";
      sendToken(user, 201, res, message);
    }
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

// user login -----------------------
userController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    let user = await userModel.findOne({ email }).select("+password");
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

userController.chart = async (req, res, next) => {

  try {
    const dates = [];
    let count = 0
    let countData = []

    const currentDate = new Date();
    const threeMonthsAgo = new Date();

    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    for (let date = threeMonthsAgo; date <= currentDate; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString())
    }
    const targetTimeStamp = new Date(dates[0]);

    let getPreious = await userModel.find({
      createdAt: { $lt: new Date(targetTimeStamp.getTime() + 24 * 60 * 60 * 1000) }
    })


    count = getPreious.length
    let data = await userModel.find({});
    dates.forEach((ele) => {
      let matchRecordData = {
        date: moment(ele).format("YYYY-MM-DD"),
        count: count
      };
      data.forEach((record) => {
        if (moment(record?.createdAt).format("YYYY-MM-DD") == moment(ele).format("YYYY-MM-DD")) {
          count++
          matchRecordData.count = count;
        }
      });

      countData.push(matchRecordData);
    });
    res.status(200).json({
      success: true,
      data: countData
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
}

userController.recentContributor = async (req, res, next) => {
  try {
    let user = await userModel.find({})
    let topRecentUser = user.reverse().slice(0, 5)
    res.status(200).json({
      statusCode: 200,
      success: true,
      data: topRecentUser
    });
  } catch (error) {
    res.status(500).json({
      newUser: error,
    });
  }
};

// user logout --------------------
userController.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
};

// user forgot password ----------------------
userController.forgotPassword = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user?.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\n you have not requested this email then ignor it `;

  try {
    await sendEmail({
      email: user.email,
      subject: `MERN project`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
};

// user reset password ---------------------------
userController.resetPassword = async (req, res, next) => {
  try {
    //creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ErrorHandler("reset password token invalid or has been expire", 400)
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("password not matched with confirm password", 400)
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    let message = "reset password successfully";
    sendToken(user, 201, res, message);
  } catch { }
};

// single user details --------------------------
userController.getUserdetails = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await userModel.findById(_id);
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch { }
};

// change password  ------------------------------
userController.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await userModel.findById(req.user._id).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }

    let matchOldPassword = await user.comparepassword(oldPassword);
    if (!matchOldPassword) {
      return next(new ErrorHandler("Enter your valid old password", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler(
          "New password are can't matched with Confirm password",
          400
        )
      );
    }
    user.password = newPassword;
    user.save();
    let message = "Change Password Successfully";
    sendToken(user, 201, res, message);
  } catch (error) { }
};

//  update user profile ----------------------------
userController.updateUserProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    let userUpdated = await userModel.findByIdAndUpdate(
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
  } catch (error) { }
};
// <----------------------admin ------------------------->
// get single user details by (admin)
userController.getUserAdmindetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get all users by (admin)
userController.getAllUsers = async (req, res, next) => {
  try {
    let user = await userModel.find();
    if (user) {
      let resp = {
        statusCode: 200,
        data: user,
      };
      res.status(200).json(resp);
    }
  } catch { }
};

//  update user profile (admin) ----------------------------

userController.updateUserRole = async (req, res, next) => {
  try {
    let { _id, role } = req.body;
    const user = await userModel.findById(_id);
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    let userUpdated = await userModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "updated",
      data: userUpdated,
    });
  } catch (error) { }
};

// delete user
userController.deleteUser = async (req, res, next) => {
  try {
    let user = await userModel.findOneAndDelete({ _id: req.params.id });
    if (user) {
      res.status(200).json({
        success: true,
        message: "deleted",
      });
    } else {
      res.status(400).json({
        success: true,
        message: "user does not exist with this id",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

userController.ShippingAddress = async (req, res, next) => {
  try {
    const user = await userModel.findById({ _id: req.user.id });
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    let data = await userModel.updateOne(
      { _id: req.user.id },
      { $push: { shippingAddress: req.body } }
    );
    res.status(200).json({
      success: true,
      message: "updated",
      data: data,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

userController.EditShippingAddress = async (req, res, next) => {
  try {
    const { address, city, pinCode, phoneNumber, country, state } = req.body;
    const user = await userModel.findById({ _id: req.body?.userId });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const shippingAddress = user.shippingAddress.id(req.body?._id);
    if (!shippingAddress) {
      return { success: false, message: "Shipping address not found" };
    }

    // Update the shipping address fields
    shippingAddress.address = address || shippingAddress.address;
    shippingAddress.city = city || shippingAddress.city;
    shippingAddress.pinCode = pinCode || shippingAddress.pinCode;
    shippingAddress.phoneNumber =
      phoneNumber || shippingAddress.phoneNumber;
    shippingAddress.country = country || shippingAddress.country;
    shippingAddress.state = state || shippingAddress.state;

    let data = await user.save();
    res.status(200).json({
      success: true,
      message: "updated",
      data: data,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export default userController;
