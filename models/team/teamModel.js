import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { type } from "os";
dotenv.config();
// let Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desgination: {
        type: String,
        required: true,
    },
    profile: {
        type: { type: String, required: false },
        url: { type: String, required: true }
    },
    about: { type: String, required: true },
    createAt: { type: Date, default: Date.now() },
});




export default mongoose.model("team", teamSchema);
