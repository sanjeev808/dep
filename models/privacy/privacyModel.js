import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const privacySchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createAt: { type: Date, default: Date.now() },
});


export default mongoose.model("privacy", privacySchema);
