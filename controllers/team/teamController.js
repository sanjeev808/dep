import ErrorHandler from "../../utils/errorHandler.js";
import teamModel from "../../models//team/teamModel.js";

import dotenv from "dotenv";
dotenv.config();
const teamController = {};

teamController.addMembers = async (req, res, next) => {
  try {
    let { name, desgination, profile, about } = req.body

    if (!name) {
      return next(new ErrorHandler("Name is required", 400));
    }
    if (!desgination) {
      return next(new ErrorHandler("Desgination is required", 400));
    }
    if (!profile.url) {
      return next(new ErrorHandler("cover image  is required", 400));
    }
    if (!about) {
      return next(new ErrorHandler("Bbout is required", 400));
    }
    let team = {
      name: name,
      desgination: desgination,
      profile: profile,
      about: about
    }

    const user = await teamModel.create(team);
    let message = "Team member added successfully";
    res.status(201).json({
      statusCode: 201,
      success: true,
      msg: message,
      user: user
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

teamController.getSingleTeamMember = async (req, res, next) => {
  try {
    console.log(req.params, "jlajlkajsld")
    let { id } = req.params
    const member = await teamModel.findOne({ _id: id });
    if (!member) {
      return next(new ErrorHandler("Team member not found", 400));
    }
    console.log(member, "v")
    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message,
    });
  }
};

teamController.updateSingleTeamMember = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const member = await teamModel.findById(_id);
    if (!member) {
      return next(new ErrorHandler("Team member not found", 400));
    }

    const updatedMember = await teamModel.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMember,
      statusCode: 200
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

teamController.deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await teamModel.findById({ _id: id });
    if (!member) {
      return next(new ErrorHandler("Team member not found", 404));
    }

    await teamModel.findByIdAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

teamController.getAllTeamMember = async (req, res, next) => {
  try {
    let user = await teamModel.find();
    if (user) {
      let resp = {
        statusCode: 200,
        data: user,
      };
      res.status(200).json(resp);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export default teamController;
