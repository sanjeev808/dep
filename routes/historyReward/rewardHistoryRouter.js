import express from "express";
import rewardHistorycontroller from "../../controllers/rewardHistory/rewardHistorycontroller.js";
import validator from "../../middleware/Authication.js";

const rewardHistoryRouter = express.Router();

const getRewardUserHistory = [
  validator.checkUserToken,
  rewardHistorycontroller.getRewardUserHistory,
];
rewardHistoryRouter.get("/history/reward", getRewardUserHistory);

export default rewardHistoryRouter;
