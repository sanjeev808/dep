// user install packages
import express from "express";
const app = express();
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import http from "http";
import bodyParser from "body-parser";
import "./dbconfig.js";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";


import errorHandler from "./middleware/error.js";
import userRouter from "./routes/userRoute.js";
import assetsRouter from "./routes/assets.js";
import multipleAssetsRouter from "./routes/multipleAssetsRouter.js";
import videoDetailsRouter from "./routes/videoDetailsRoute.js";
import adminRouter from "./routes/admin/adminRoute.js";
import teamRouter from "./routes/team/teamRoute.js";
import litePaperRouter from "./routes/litePaper/litePaper.js";
import rewardDetailRouter from "./routes/rewardRoute.js";
import rewardHistoryRouter from "./routes/historyReward/rewardHistoryRouter.js";
import privacyRouter from "./routes/privacy/privacy.js";
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  next();
});

app.use(express.static("assets"));
app.use("/assets", express.static("assets"));
app.use(cookieParser());

app.use("/api/v1", adminRouter)
app.use("/api/v1", teamRouter)
app.use("/api/v1", videoDetailsRouter)
app.use("/api/v1", litePaperRouter)
app.use("/api/v1", userRouter);
app.use("/api/v1", assetsRouter);
app.use("/api/v1", multipleAssetsRouter);
app.use("/api/v1", rewardDetailRouter);
app.use("/api/v1", rewardHistoryRouter);
app.use("/api/v1", privacyRouter);

app.use(errorHandler);
// create https server
const server = http.createServer(app);

let PORT = process.env.PORT || 3000;
const data = server.listen(PORT, console.log("server start", PORT));
export default data;
