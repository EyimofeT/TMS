import jwt from "jsonwebtoken";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { get_user_account_by_id, update_user_by_id } from "../user/crud.js";
import { isTokenValid } from "../auth/helper.js";
import multer from 'multer';
import {add_user_to_project, create_project, read_project_x_user, read_user_project_by_user_id, read_user_project_by_user_id_project_id, delete_user_from_project} from './crud.js'
import { v2 as cloudinary } from 'cloudinary'; 
import { is_user_admin } from "../role/helper.js";
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

export const create_user_project = async (req, res) => {
  try{

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    let {name, description} = req.body
    let project_id = crypto.randomUUID()
    let entry_id = crypto.randomUUID()

    let project = await create_project(user.user_id, name, description, project_id, entry_id)
    if(!project) throw new CustomError("Something went wrong trying to create project", "09")

    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "Project created successfully",
      data: project,
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

export const get_user_project = async (req, res) => {
  try{

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    let project = await read_user_project_by_user_id(user.user_id)
    if(!project) throw new CustomError("Something went wrong trying to fetch projects", "09")
    
    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "Project created successfully",
      data: project,
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

export const get_user_project_by_project_id = async (req, res) => {
  try{

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    let {project_id} = req.params

    let project = await read_user_project_by_user_id_project_id(user.user_id, project_id)
    if(!project) throw new CustomError("Unable to find project", "09")
    
    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "Project created successfully",
      data: project,
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

export const add_user_project = async (req, res) => {
  try{
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    // let {project_id} = req.params
    let project_id = req.body.project_id
    let new_user_id = req.body.user_id
    let role = req.body.role

    //check if user exists
    if(!await get_user_account_by_id(new_user_id)) throw new CustomError("Unable to find user account", "09")

    //check if user is already part of project
    if(await read_project_x_user(new_user_id, project_id)) throw new CustomError("User has already been added to this project", "09")

    let project = await read_project_x_user(user.user_id, project_id)
    if(!project) throw new CustomError("Unabe to associate your account with the specified project", "09")

    let user_project_role = project.role
    let project_owner_id = project.project.creator_id
    let is_admin = is_user_admin(user_project_role)
    let is_project_owner = user.user_id == project_owner_id
    
    if(!is_admin && !is_project_owner) throw new CustomError("You do not have required permissions to perform this action", "09")

    // console.log(user_project_role == 'admin')
    // console.log(user.user_id == project_owner_id)
    // console.log(is_admin)

    let project_user_data = {
      entry_id : crypto.randomUUID(),
      user_id : new_user_id,
      project_id : project_id,  
    }

    if(role != undefined && role != '') project_user_data.role = role


    // console.log(project_user_data)

    let user_x_project = await add_user_to_project(project_user_data)
    if(!user_x_project) throw new CustomError("Something went wrong", "09")
    // {
    //   entry_id,
    //   user_id,
    //   project_id,
    //   role: 'admin'
    // }

    
    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "User added successfully",
      data: user_x_project,
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

export const delete_user_project = async (req, res) => {
  try{

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    // let {project_id} = req.params
    let project_id = req.body.project_id
    let new_user_id = req.body.user_id
    let role = req.body.role

    //check if user exists
    if(!await get_user_account_by_id(new_user_id)) throw new CustomError("Unable to find user account", "09")

    //check if user is already part of project
    if(!await read_project_x_user(new_user_id, project_id)) throw new CustomError("User is not associated with this project", "09")

    let project = await read_project_x_user(user.user_id, project_id)
    if(!project) throw new CustomError("Unabe to associate your account with the specified project", "09")

    let user_project_role = project.role
    let project_owner_id = project.project.creator_id
    let is_admin = is_user_admin(user_project_role)
    let is_project_owner = user.user_id == project_owner_id
    
    if(!is_admin && !is_project_owner) throw new CustomError("You do not have required permissions to perform this action", "09")
    if(new_user_id == project_owner_id) throw new CustomError("You do not have required permissions to perform this action", "09")
    if(user.user_id == new_user_id) throw new CustomError("You cannot perform this action", "09")

    
    let delete_status = await delete_user_from_project(new_user_id, project_id)
    if(!delete_status) throw new CustomError("Something went wrong while trying to delete user from project", "09")

    
    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "User deleted from project successfully",
      data: delete_status,
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