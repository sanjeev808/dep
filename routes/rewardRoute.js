import express from "express";
import rewardController from "../controllers/rewardController.js";
import validator from "../middleware/Authication.js";

const rewardDetailRouter = express.Router();

const getRewardDetail = [
  rewardController.getRewardDetail,
];
rewardDetailRouter.get("/reward/:userId", getRewardDetail);

const getchart = [
  rewardController.getchart,
];
rewardDetailRouter.get("/rewards/chart", getchart);

const topRewardedUser = [
  rewardController.topRewardedUser,
];
rewardDetailRouter.get("/rewards/topRewardedUser", topRewardedUser);

export default rewardDetailRouter;
