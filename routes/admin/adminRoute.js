import express from "express";
import adminController from "../../controllers/admin/adminController.js";
import validator from "../../middleware/Authication.js";

const adminRouter = express.Router();

const adminRegister = [
  validator.isAdminEmailExist,
  validator.checkUserDetails,
  adminController.adminRegister,
];
adminRouter.post("/admin/register", adminRegister);

const adminProfile = [
  validator.isAuthenticatedUser,
  adminController.adminProfile,
];
adminRouter.get("/admin/profile", adminProfile);

const adminEditProfile = [
  validator.isAuthenticatedUser,
  adminController.adminEditProfile,
];
adminRouter.put("/admin/edit", adminEditProfile);
const adminLogin = [
  adminController.adminLogin,
];
adminRouter.post("/admin/login", adminLogin);
export default adminRouter;
