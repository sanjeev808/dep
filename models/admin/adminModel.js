import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
// let Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const adminSchema = new mongoose.Schema({
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

    password: {
        type: String,
        required: [true, "Please Enter Password"],
        minLength: [8, "Password should have more 8 characters"],
        select: false,
    },

    avatar: {
        public_id: { type: String, required: false, default: "admin avatar" },
        url: { type: String, required: false},
    },

    createdAt: { type: Date, default: Date.now() },
    role: {
        type: String,
        default: "admin",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN

adminSchema.methods.getJWTToken = function () {
    return Jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
};

adminSchema.methods.comparepassword = async function (enteredPassword) {
    try {
        const match = await bcrypt.compare(enteredPassword, this.password);
        return match;
    } catch (error) {
        throw error; // Handle the error appropriately in your application
    }
};

adminSchema.methods.getResetPasswordToken = function () {
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
export default mongoose.model("admin", adminSchema);
