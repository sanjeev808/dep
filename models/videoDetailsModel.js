import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
// let Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const videoDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId, ref: "User",
        required: true,
    },
    videoHash: {
        type: String,
        required: true,
    },
    jsonHash: {
        type: String,
        required: true,
    },
    coordinates: {
        lat: { type: String, required: true },
        lng: { type: String, required: true }
    },
    category:
    {
        type: String,
        enum:["open area", "venue"],
        required: true,
    },
    areaCovered: {
        type: String,
        enum:["Indoor", "Outdoor"],
        required: true,
    },
    txHash: {
        type: String,
        required: true,
    },

    TimeStamp: { type: Date, default: Date.now() },
});




export default mongoose.model("videoDetail", videoDetailsSchema);
    