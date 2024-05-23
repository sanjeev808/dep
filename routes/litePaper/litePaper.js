import express from "express";
import litePaperController from "../../controllers/litePaper/litePaperController.js";
import validator from "../../middleware/Authication.js";

const litePaperRouter = express.Router();

const addLitePaper = [
    litePaperController.addLitePaper,
];
litePaperRouter.post("/litePaper/create", addLitePaper);

const editLitePaper = [
    litePaperController.editLitePaper,
];
litePaperRouter.put("/litePaper/edit", editLitePaper);

const deleteLitePaper = [
    litePaperController.deleteLitePaper,
];
litePaperRouter.delete("/litePaper/delete/:id", deleteLitePaper);


const getAllLitePapers = [
    litePaperController.getAllLitePapers,
];
litePaperRouter.get("/litePaper/all", getAllLitePapers);


export default litePaperRouter;
