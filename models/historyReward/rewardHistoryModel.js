import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const rewardHistorySchema = new mongoose.Schema({
    date: { type: String, required: true },
    rewards: [
        {
            id: { type: String, required: true },
            reward: { type: Number, required: true }
        }
    ]
});


export default mongoose.model("rewardHistory", rewardHistorySchema);