// import Product from "../../../../model/user/product.js";
import mongoose from "mongoose";

const assetsController = {};

assetsController.assets = async (req, res, next) => {
  try {
    console.log(req.file)
    if (req.file.path) {
      let resp = {
        statusCode: 200,
        data: `http://localhost:3000/${req.file.path}`,
        message: "Assets uploaded successfully",
      };
      res.status(200).json(resp);
    } else {
    }
  } catch {
    let err = {
      massage: "Image not valid",
      statusCode: 400,
    };
    res.status(400).json(err);
  }
};

export default assetsController;
