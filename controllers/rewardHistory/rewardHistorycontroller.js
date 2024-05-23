import rewardHistoryModel from "../../models/historyReward/rewardHistoryModel.js";
import dotenv from "dotenv";
import moment from "moment";

const rewardHistorycontroller = {};

rewardHistorycontroller.getRewardUserHistory = async (req, res) => {
  try {
    let date = new Date();
    let pipeline = [
      { $match: { date: moment(date).format("YYYY-MM-DD") } },
      { $unwind: "$rewards" },  
      { $match: { "rewards.id": req.user.id } },
      { $group: { _id: "$date", userRewards: { $sum: "$rewards.reward" } } },
    ];
    let data = await rewardHistoryModel.aggregate(pipeline);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

export default rewardHistorycontroller;
