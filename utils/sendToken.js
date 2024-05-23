const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  // const option = {
  //   expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  //   httpOnly:true
  // };
  res.status(statusCode).json({
    success: true,
    statusCode:statusCode,
    user,
    token: token,
    message: message,
  });
};

export default sendToken;
