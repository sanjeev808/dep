import express from "express";
import videoDetailsController from "../controllers/videoDetailsController.js";
import validator from "../middleware/Authication.js";

const videoDetailsRouter = express.Router();

const videoDetails = [
  validator.checkUserToken,
  validator.checkVideoDetails, 
  videoDetailsController.videoDetails,
];
videoDetailsRouter.post("/video/create", videoDetails);

const getAllVideoDetails = [
  videoDetailsController.getAllVideoDetails,
];
videoDetailsRouter.get("/video/all", getAllVideoDetails);


const countVideoAndUser = [
  videoDetailsController.countVideoAndUser,
];
videoDetailsRouter.get("/video/count" , countVideoAndUser)


const ChartData = [
  videoDetailsController.ChartData,
];
videoDetailsRouter.get("/video/chart" , ChartData)
export default videoDetailsRouter;
