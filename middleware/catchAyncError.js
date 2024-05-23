import { promises } from "fs";
import ErrorHandler from "../utils/errorHandler.js";

const catchAsyncError = (req, res, next) => {
  promises.resolve(catchAsyncError(req, res, next)).catch(next);
};

export default catchAsyncError;
