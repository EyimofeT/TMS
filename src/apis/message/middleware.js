// import is_reques
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

  
  
export const project_group_message_middleware = async (req, res, next) => {
    try {
      let {message, project_id} = req.body
      if (!message) throw new CustomError("message required","02");
      if(!project_id) throw new CustomError("project_id required", "02")

      //logic for attachment
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