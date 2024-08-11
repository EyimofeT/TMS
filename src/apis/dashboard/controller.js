import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { isTokenValid } from "../auth/helper.js";
import { get_user_account_by_id } from "../user/crud.js";
import multer from 'multer';
import {} from './crud.js'
import { v2 as cloudinary } from 'cloudinary'; 
cloudinary.config({ 
  cloud_name: getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key: getenv("CLOUDINARY_API_KEY"), 
  api_secret: getenv("CLOUDINARY_API_SECRET") 
});
const folderName = 'TMS';
const storage = multer.memoryStorage();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});

export const get_dashboard = async (req, res) => {
  try{

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    let dashboard_data = {
      data : true
    }

    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "Dashboard data fetched successfully",
      data: dashboard_data,
    });

  } catch (err) {
      return res.status(200).json({
        code: 400 ,
        responseCode: err.code ,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally { 
  
    }
}
