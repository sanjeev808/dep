import express from "express";
import privacyController from "../../controllers/privacy/privacyController.js";
import validator from "../../middleware/Authication.js";

const privacyRouter = express.Router();

const addprivacy = [
    privacyController.addprivacy,
];
privacyRouter.post("/privacy/create", addprivacy);

const editprivacy = [
    privacyController.editprivacy,
];
privacyRouter.put("/privacy/edit", editprivacy);

const deleteprivacy = [
    privacyController.deleteprivacy,
];
privacyRouter.delete("/privacy/delete/:id", deleteprivacy);


const getAllprivacy = [
    privacyController.getAllprivacy,
];
privacyRouter.get("/privacy/all", getAllprivacy);


export default privacyRouter;
