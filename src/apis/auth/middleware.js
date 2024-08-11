import { removeLeadingZero } from "./helper.js";

export const signup_middleware = async (req, res, next) => {
    try{
      if(is_request_empty(req, res)) throw new CustomError("Cannot Pass Empty Request","02")
      
      let {first_name, last_name, phone, email, password} = req.body;
      
      if(!first_name) throw new CustomError("first_name required","02")
      if(!last_name) throw new CustomError("last_name required","02")
      if(!phone) throw new CustomError("phone required","02")
      if(!email) throw new CustomError("email required","02")
      if(!password) throw new CustomError("password required","02")
  
      const phoneNumberRegex = /^\+234\d{10}$/;
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if(!phoneNumberRegex.test(phone)) throw new CustomError("Invalid phone input format e.g +234xxx", "04")
      if(!emailRegex.test(email)) throw new CustomError("Invalid email input format e.g example@example.com", "04")


      for(const key in req.body){
        if(typeof  req.body[key]  == 'string')  req.body[key] = req.body[key].toLowerCase().trim()
      }
      next();
    }
    catch (err) {
      return res.status(200).json({
        code: 400,  responseCode: err.code , 
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    };
  }

  export const login_middleware = async (req, res, next) => {
    try{
      if(is_request_empty(req, res)) throw new CustomError("Cannot Pass Empty Request","02")
      
      let {identifier, password} = req.body;
      
      if(!identifier) throw new CustomError("identifier required","02")
      if(!password) throw new CustomError("password required","02")

      identifier = removeLeadingZero(identifier)
      identifier = identifier.toLowerCase().trim()

      req.body.identifier = identifier

    //console.log(identifier.toLowerCase())

      next();
    }
    catch (err) {
      return res.status(200).json({
        code: 400,  responseCode: err.code , 
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    };
  }