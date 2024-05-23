import express from "express";
import userController from "../controllers/userController.js";
import validator from "../middleware/Authication.js";

const userRouter = express.Router();

const register = [
  validator.isEmailExist,
  validator.checkUserDetails,
  userController.register,
];
userRouter.post("/user/register", register);

const login = [userController.login];
userRouter.post("/user/login", login);

const chart = [userController.chart];
userRouter.get("/user/chart", chart);

const recentContributor = [userController.recentContributor];
userRouter.get("/user/recent/contributor", recentContributor);

const logout = [userController.logout];
userRouter.get("/user/logout", logout);

const forgotPassword = [userController.forgotPassword];
userRouter.post("/user/forgot", forgotPassword);

const resetPassword = [userController.resetPassword];
userRouter.put("/user/resetPassword/:token", resetPassword);

const getUserdetails = [
  validator.isAuthenticatedUser,
  userController.getUserdetails,
];
userRouter.get("/user/getUserdetails", getUserdetails);

const changePassword = [
  validator.isAuthenticatedUser,
  userController.changePassword,
];
userRouter.put("/user/changePassword", changePassword);

const updateUserProfile = [
  validator.checkUserToken,
  userController.updateUserProfile,
];
userRouter.put("/user/edit/profile", updateUserProfile);

const getUserAdmindetails = [
  validator.isAuthenticatedUser,
  validator.authorizeRoles("admin"),
  userController.getUserAdmindetails,
];
userRouter.get("/admin/userDetail/:id", getUserAdmindetails);

const getAllUsers = [
  validator.isAuthenticatedUser,
  validator.authorizeRoles("admin"),
  userController.getAllUsers,
];
userRouter.get("/admin/userListing", getAllUsers);

const updateUserRole = [
  validator.isAuthenticatedUser,
  validator.authorizeRoles("admin"),
  userController.updateUserRole,
];
userRouter.put("/admin/updateUserRole", updateUserRole);

const deleteUser = [
  validator.isAuthenticatedUser,
  validator.authorizeRoles("admin"),
  userController.deleteUser,
];
userRouter.delete("/admin/deleteUser/:id", deleteUser);
const ShippingAddress = [
  validator.isAuthenticatedUser,
  userController.ShippingAddress,
];
userRouter.put("/user/update/add/shippingAdress", ShippingAddress);
const EditShippingAddress = [
  validator.isAuthenticatedUser,
  userController.EditShippingAddress,
];
userRouter.put("/user/update/edit/shippingAddress", EditShippingAddress);

export default userRouter;
