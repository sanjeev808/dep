import rewardModel from "../models/rewardModel.js";
import dotenv from "dotenv";
import moment from "moment"
dotenv.config();
// import ApiFeatures from "../utils/apiFeatures.js";

const rewardController = {};

rewardController.getRewardDetail = async (req, res) => {
  try {
    const reward = await rewardModel.findOne({ userId: req.params.userId });
    res.status(200).json({
      success: true,
      data: reward,
    });

  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

rewardController.getchart = async (req, res) => {
  try {
    console.log("awdasdasds")
    const dates = [];
    let count = 0
    let countData = []

    const currentDate = new Date();
    const threeMonthsAgo = new Date();

    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    for (let date = threeMonthsAgo; date <= currentDate; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString())
    }
    const targetTimeStamp = new Date(dates[0]);

    let getPrevious = await rewardModel.aggregate([
      {
        $match: {
          LastUpdated: { $lt: new Date(targetTimeStamp.getTime() + 24 * 60 * 60 * 1000) }
        }
      },
      {
        $project: {
          reward: 1,
          _id: 0
        }
      },
      {
        $group: {
          _id: null,
          totalRewards: { $sum: "$reward" }
        }
      }
    ]);

    count = count + getPrevious[0].totalRewards;


    let data = await rewardModel.find({});
    dates.forEach((ele) => {
      let matchRecordData = {
        date: moment(ele).format("YYYY-MM-DD"),
        count: count
      };
      data.forEach((record) => {
        if (moment(record?.LastUpdated).format("YYYY-MM-DD") == moment(ele).format("YYYY-MM-DD")) {
          count = count + record.reward
          matchRecordData.count = count;
        }
      });

      countData.push(matchRecordData);
    });
    res.status(200).json({
      success: true,
      data: countData
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

rewardController.topRewardedUser = async (req, res) => {
  try {
    const topUsers = await rewardModel.aggregate([
      {
        $group: {
          _id: "$userId",
          totalReward: { $sum: "$reward" },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $sort: { totalReward: -1 }
      },
      {
        $limit: 5
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      }
    ])
    
    res.status(200).json({
      success: true,
      message: topUsers.length > 0 ? "get top rewarded user" : "not found any top rewarded user",
      data: topUsers,
    });

  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};
export default rewardController;
