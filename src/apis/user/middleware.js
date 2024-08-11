
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

export const update_profile_middleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new CustomError("Authentication token required","05");

    const allowedKeys = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "profile_photo"
    ]
    for (const key in req.body) {
      if (!allowedKeys.includes(key)) {
        delete req.body[key];
      }
    }

    // console.log(req.body)
    if(req.body.email){
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if(!emailRegex.test(req.body.email)) throw new CustomError("Invalid email input format e.g example@example.com", "04")
    }

    if(req.body.phone){
      const phoneNumberRegex = /^\+234\d{10}$/;
      if(!phoneNumberRegex.test(req.body.phone)) throw new CustomError("Invalid phone input format e.g +234xxx", "04")
    }

    for(const key in req.body){
      if(typeof  req.body[key]  == 'string')  req.body[key] = req.body[key].toLowerCase().trim()
    }

    // console.log("here now")
    // console.log(req.files)

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
}