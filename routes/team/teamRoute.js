import express from "express";
import teamController from "../../controllers/team/teamController.js";
import validator from "../../middleware/Authication.js";

const teamRouter = express.Router();

const addMembers = [
  validator.isAuthenticatedUser,
  validator.checkRole,
  teamController.addMembers,
];
teamRouter.post("/team/create", addMembers);

const getSingleTeamMember = [
  teamController.getSingleTeamMember,
];
teamRouter.get("/team/member/:id", getSingleTeamMember);

const updateSingleTeamMember = [
  validator.isAuthenticatedUser,
  validator.checkRole,
  teamController.updateSingleTeamMember,
];
teamRouter.put("/team/member/update", updateSingleTeamMember);

const deleteTeamMember = [
  validator.isAuthenticatedUser,
  validator.checkRole,
  teamController.deleteTeamMember,
];
teamRouter.delete("/team/member/delete/:id", deleteTeamMember);

const getAllTeamMember = [
  teamController.getAllTeamMember,
];
teamRouter.get("/team/members/all", getAllTeamMember);



export default teamRouter;
