import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// let Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const rewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId, ref: "User",
        required: true,
    },
    reward: {
        type: Number,
        required: true,
        default:0,
    },
    LastUpdated: { type: Date, default: Date.now() },
});




export default mongoose.model("reward", rewardSchema);
