
export const authcheck = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new CustomError("Authentication token required","05");
    next();
  } catch (err) {
    return res.status(200).json({
      code: 400 ,
      responseCode: err.code ,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  }
};

