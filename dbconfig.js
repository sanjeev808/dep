import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// connect with local mongoDB
const dbHost = process.env.DATABSE_URL;
console.log(`DB Host: ${dbHost}`);
mongoose.connect(dbHost);

mongoose.connection.on("error", (err) => {
  console.log("error meaashshahs", err);
});

mongoose.connection.on("connected", (connected) => {
  console.log("connected with database....");
});
