import ErrorHandler from "../utils/errorHandler.js";
import videoDetailsModel from "../models/videoDetailsModel.js";
import rewardModel from "../models/rewardModel.js";

import getProvider from "../utils/provider.js";
import dotenv from "dotenv";
import axios from "axios";
import { ethers } from "ethers";
import userModel from "../models/userModel.js";
import moment from "moment"
import updateOrCreateRecord from "../utils/rewardHistory.js";
dotenv.config();

const PINATA_TOKEN = process.env.PINATA_TOKEN;
const PINATA_URL = process.env.PINATA_URL;


const videoDetailsController = {};
videoDetailsController.videoDetails = async (req, res) => {

  try {
    const { videoHash, category, areaCovered, coordinates } = req.body
    let videoData = {
      videoHash: videoHash,
      category: category,
      areaCovered: areaCovered,
      coordinates: coordinates,
      userId: req.user.id
    }
    let videoContract = await getProvider()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: "Bearer " + PINATA_TOKEN,
    };

    let responseJsonHash = await axios.post(PINATA_URL, videoData, { headers })
    if (responseJsonHash?.data.IpfsHash) {

      const videoUploadTx = await videoContract.uploadtoIPFs(responseJsonHash?.data.IpfsHash, req.user.id);

      if (videoUploadTx.hash) {
        let videoDataJson = {
          videoHash: videoHash,
          category: category,
          areaCovered: areaCovered,
          coordinates: coordinates,
          userId: req.user.id,
          jsonHash: responseJsonHash?.data.IpfsHash,
          txHash: videoUploadTx.hash
        }
        const user = await videoDetailsModel.create(videoDataJson);
        let message = "created";
        const reward = await rewardModel.findOne({ userId: req.user.id });
        let rewardCount = 0;

        if (!reward) {
          let rewardQuery = await rewardModel.create({ userId: req.user.id, reward: 10 });
          rewardCount = 10;
        } else {
          let rewardQuery = await rewardModel.findOneAndUpdate({ userId: req.user.id, reward: reward.reward + 10 });
          rewardCount = reward.reward + 10;

        }

        let date = new Date()
        let data = await updateOrCreateRecord(moment(date).format("YYYY-MM-DD"), req.user.id, 10);

        if (data) {
          res.status(201).json({
            success: true,
            msg: message,
            rewardCount: rewardCount,
            data: user
          });
        }
        else {
          res.status(400).json({
            success: false,
            statusCode: 400,
            error: "video not uploaded",
          })
        }


      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

videoDetailsController.getAllVideoDetails = async (req, res) => {
  try {

    let videoPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },

    ];
    let data = await videoDetailsModel.aggregate(videoPipeline);


    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};


videoDetailsController.countVideoAndUser = async (req, res) => {
  try {

    let videoCount = await videoDetailsModel.countDocuments().exec();
    let contributors = await userModel.countDocuments().exec();

    // check in pipeline 
    let checkinPipeline =
      [
        {
          $group: {
            _id: "$videoDetailsModel",
            venue: {
              $sum: {
                $cond: [
                  { $eq: ["$category", "venue"] },
                  1,
                  0
                ]
              }
            },
            openArea: {
              $sum: {
                $cond: [
                  { $eq: ["$category", "open area"] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]
    let data = await videoDetailsModel.aggregate(checkinPipeline)
    let checkIn = {
      openArea: data[0].openArea,
      venue: data[0].venue,
      totalCheckIn: data[0].openArea + data[0].venue
    }

    // AreaCovered pipieline

    let areaCoveredPipeline = [
      {
        $group: {
          _id: "$videoDetailsModel",
          Indoor: {
            $sum: {
              $cond: [
                { $eq: ["$areaCovered", "Indoor"] },
                1,
                0
              ]
            }
          },
          Outdoor: {
            $sum: {
              $cond: [
                { $eq: ["$areaCovered", "Outdoor"] },
                1,
                0
              ]
            }
          }
        }
      }
    ]

    let areaCoveredData = await videoDetailsModel.aggregate(areaCoveredPipeline)
    let areaCovered = {
      Indoor: areaCoveredData[0].Indoor,
      Outdoor: areaCoveredData[0].Outdoor,
      totalAreaCovered: areaCoveredData[0].Indoor + areaCoveredData[0].Outdoor
    }

    const pipeline = [
      {
        $group: {
          _id: '$rewardModel',
          totalRewards: { $sum: '$reward' }
        }
      }
    ];
    let rewardData = await rewardModel.aggregate(pipeline)

    // console.log(rewardData, "rewardModelDatarewardModelData")
    res.status(200).json({
      success: true,
      statusCode :200,
      videoCount: videoCount,
      contributors: contributors,
      checkIn: checkIn,
      areaCovered: areaCovered,
      rewards: rewardData[0].totalRewards
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};


videoDetailsController.ChartData = async (req, res) => {
  try {
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

    let getPreious = await videoDetailsModel.find({
      TimeStamp: { $lt: new Date(targetTimeStamp.getTime() + 24 * 60 * 60 * 1000) }
    })


    count = getPreious.length
    let data = await videoDetailsModel.find({});
    dates.forEach((ele) => {
      let matchRecordData = {
        date: moment(ele).format("YYYY-MM-DD"),
        count: count
      };
      data.forEach((record) => {
        if (moment(record?.TimeStamp).format("YYYY-MM-DD") == moment(ele).format("YYYY-MM-DD")) {
          count++
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

export default videoDetailsController;
