import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { type } from "os";
dotenv.config();
// let Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot exceed 30 characters"],
    minLength: [4, "Name should have more 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
  },
  DOB:{
    type: String,
    required: [true, "Please Enter Date of birth"],
  },
  gender:{
    type: Number,
    required: [true, "Please Enter Gender"],  // 1 for men 2 gender 3 other
  },
  mobileNo:{
    type: String,
    required: [true, "Please Enter Phone number"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password Name"],
    minLength: [8, "Name should have more 8 characters"],
    select: false,
  },

  avatar: {
    public_id: { type: String, required: false, default: "user avatar" },
    url: { type: String, required: false },
  },

  createdAt: { type: Date, default: Date.now() },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN

userSchema.methods.getJWTToken = function () {
  return Jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
};

userSchema.methods.comparepassword = async function (enteredPassword) {
  try {
    const match = await bcrypt.compare(enteredPassword, this.password);
    return match;
  } catch (error) {
    throw error; // Handle the error appropriately in your application
  }
};

userSchema.methods.getResetPasswordToken = function () {
  //
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding resetPassword user

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
export default mongoose.model("users", userSchema);
