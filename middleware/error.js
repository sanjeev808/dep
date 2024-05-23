import ErrorHandler from "../utils/errorHandler.js";

const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  res.status(err.statusCode).json({
    success: false,
    statusCode:err.statusCode,
    message: err.message,
  });
};


export default error;
