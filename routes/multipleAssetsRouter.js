import express from "express";
const multipleAssetsRouter = express.Router();
import assetsController from "../controllers/assetsController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const dir = "./assets";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

if (fs.existsSync(`${dir}`)) {
  var storage = multer.diskStorage({
    destination: `${dir}`,
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  var imageUpload = multer({
    storage: storage,
    limits: {
      fileSize: 100000000, // 1000000 Bytes = 1 MB
    },
  });
}

const assets = [
  imageUpload.array("assets"),
  (req, res) => {
    const data = req.files.map((file) => {
      let resp = {
        data: `http://localhost:3000/${file.filename}`,
      };
      return resp
    });
    

    res.status(200).json({data});
  },
  // assetsController.assets,
];
multipleAssetsRouter.post("/multiple/assets", assets);

export default multipleAssetsRouter;
