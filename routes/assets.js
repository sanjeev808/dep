import express from "express";
import assetsController from "../controllers/assetsController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const assetsRouter = express.Router();
const dir = "./assets";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

if (fs.existsSync(dir)) {
  var storage = multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 100000000, // 1000000 Bytes = 1 MB
    },
  }).single("assets");
}

assetsRouter.post("/assets", upload, (req, res) => {
  if (req.file) {
    const response = {
      statusCode: 200,
      data: `http://localhost:3000/${req.file.filename}`,
      message: "Asset uploaded successfully",
    };
    res.status(200).json(response);
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

export default assetsRouter;
