import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { isTokenValid } from "../auth/helper.js";
import { get_user_account_by_id } from "../user/crud.js";
import { read_project_x_user, read_user_project_by_user_id, read_user_project_by_user_id_project_id } from "../project/crud.js";
import multer from 'multer';
import { create_task, read_all_task, update_task } from './crud.js'
import { v2 as cloudinary } from 'cloudinary';
import { is_user_admin } from "../role/helper.js";
import crypto from "crypto";
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

export const create_user_task = async (req, res) => {
  try {

    let { title, description, user_id, project_id, due_date, notes } = req.body
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let creator_user_id = token_data.user_id

    let creator_user = await get_user_account_by_id(creator_user_id)
    if (!creator_user) throw new CustomError("Something went wrong", "09")

    // let creator_x_project = await read_user_project_by_user_id_project_id(creator_user.user_id, project_id)
    let creator_x_project = await read_project_x_user(creator_user.user_id, project_id)
    if (!creator_x_project) throw new CustomError("You are not associated with this project", "09")

    console.log(creator_x_project)
    if (!is_user_admin(creator_x_project.role) && creator_user.user_id != creator_x_project.project.creator_id) throw new CustomError("You are not permitted to carry out this action", "09")

    let user_x_project = await read_user_project_by_user_id_project_id(user_id, project_id)
    if (!user_x_project) throw new CustomError("The user selected is not associated with this project", "09")

    //create task
    let task_id = crypto.randomUUID()
    let task_data = {
      task_id,
      title,
      description,
      user_id,
      project_id,
      due_date,
      assigned_by_user_entry: creator_x_project.entry_id,
      notes
    }

    // console.log(task_data)
    if (!await create_task(task_data)) throw new CustomError("Something went wrong", "09")


    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Task created successfully",
      data: {
        task_id, title, description, due_date
      },
    });

  }
  catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}

export const get_user_task = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let creator_user_id = token_data.user_id

    let creator_user = await get_user_account_by_id(creator_user_id)
    if (!creator_user) throw new CustomError("Something went wrong", "09")

    let project_id = req.params.project_id
    console.log(project_id)
    if (project_id == undefined || project_id == null || project_id == '') throw new CustomError("Invalid project_id value", "09")

    let user_x_project = await read_project_x_user(creator_user.user_id, project_id)
    if (!user_x_project) throw new CustomError("You are not associated with this project", "09")
    console.log(user_x_project)

    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Task fetched successfully",
      data: 'coming',
    });

  }
  catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}

export const get_all_user_tasks_by_project_id = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if (!user) throw new CustomError("Something went wrong", "09")

    let project_id = req.params.project_id
    if (project_id == undefined || project_id == null || project_id == '') throw new CustomError("Invalid project_id value", "09")

    let user_x_project = await read_project_x_user(user.user_id, project_id)
    if (!user_x_project) throw new CustomError("You are not associated with this project", "09")
    console.log(user_x_project)

    //get all tasks
    let task_where = {
      project_id
    }
    let tasks = await read_all_task(task_where)
    if (!tasks) throw new CustomError("Something went wrong", "09")

    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Task fetched successfully",
      data: { user_id, tasks },
    });

  }
  catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}

export const update_user_task_status = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if (!user) throw new CustomError("Something went wrong", "09")

    let { task_id, project_id, status } = req.body

    // let project_id = req.params.project_id
    // console.log(project_id)
    // if(project_id == undefined || project_id == null || project_id == '') throw new CustomError("Invalid project_id value", "09")

    let user_x_project = await read_project_x_user(user.user_id, project_id)
    if (!user_x_project) throw new CustomError("You are not associated with this project", "09")
    // console.log(user_x_project)
    // if(user_x_project)


    let task_where = {
      task_id,
      project_id
    }
    let tasks = await read_all_task(task_where)
    if (!tasks) throw new CustomError("Something went wrong", "09")
    tasks = tasks[0]

    if (user.user_id != tasks.user_id && !is_user_admin(user_x_project.role)) throw new CustomError("You are not authorized to perform the action", "09")

    if (tasks.final_status != 'pending') throw new CustomError(`Task is no loger active`, "09")

    let current_status = tasks.status
    if (current_status == status) throw new CustomError(`Task current status is ${status}`, "09")

    let task_update_data = {
      status
    }
    if (status == 'completed') task_update_data.date_completed = new Date()
    let update_task_status = await update_task(task_id, project_id, task_update_data)
    if (!update_task_status) throw new CustomError(`Something went wrong`, "09")

    //Fetch task again
    tasks = await read_all_task(task_where)
    if (!tasks) throw new CustomError("Something went wrong", "09")
    tasks = tasks[0]

    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Task updated successfully",
      data: tasks,
    });

  }
  catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}

export const update_user_task = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if (!user) throw new CustomError("Something went wrong", "09")

    let { task_id, project_id } = req.params
    if (!task_id || task_id == undefined || task_id == "") throw new CustomError("Invalid task/task_id supplied", "09")
    if (!project_id || project_id == undefined || project_id == "") throw new CustomError("Invalid project/project_id supplied", "09")

    let user_x_project = await read_project_x_user(user.user_id, project_id)
    if (!user_x_project) throw new CustomError("You are not associated with this project", "09")

    let task_where = {
      task_id,
      project_id
    }

    let tasks = await read_all_task(task_where)
    if (tasks.length < 1) throw new CustomError("Unable to find task", "09")
    tasks = tasks[0]

    // console.log(task_where)
    // console.log(user_x_project)
    // console.log(tasks)

    if (!is_user_admin(user_x_project.role) && user.user_id != user_x_project.project.creator_id) throw new CustomError("You are not authorized to perform the action", "09")

    let task_update_data = {
      ...req.body
    }

    if (req.body.user_id) {
      if (!await read_project_x_user(user.user_id, project_id)) throw new CustomError("New user not associated with this project", "09")
    }

    if (req.body.status) {
      if (req.body.status == 'pending' || req.body.status == 'in progress') {
        task_update_data.final_status = 'pending'
        task_update_data.date_completed = null
      }
    }
    if (req.body.final_status) {
      if (req.body.final_status == 'completed') {
        task_update_data.status = 'completed'
        task_update_data.date_completed = new Date()
      }
    }


    //   "user_id",
    //   "title",
    //   "description",
    //   "due_date",
    //   "notes",
    //   "status",
    //   "final_status"

    let update_task_status = await update_task(task_id, project_id, task_update_data)
    if(!update_task_status) throw new CustomError(`Something went wrong`, "09")

    //Fetch task again
    tasks = await read_all_task(task_where)
    if (!tasks) throw new CustomError("Something went wrong", "09")
    tasks = tasks[0]

    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Task updated successfully",
      data: tasks,
    });

  }
  catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}

export const delete_user_task = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if (!user) throw new CustomError("Something went wrong", "09")

    let { task_id, project_id } = req.params
    if (!task_id || task_id == undefined || task_id == "") throw new CustomError("Invalid task/task_id supplied", "09")
    if (!project_id || project_id == undefined || project_id == "") throw new CustomError("Invalid project/project_id supplied", "09")

    let user_x_project = await read_project_x_user(user.user_id, project_id)
    if (!user_x_project) throw new CustomError("You are not associated with this project", "09")

    let task_where = {
      task_id,
      project_id
    }

    let tasks = await read_all_task(task_where)
    if (tasks.length < 1) throw new CustomError("Unable to find task", "09")
    tasks = tasks[0]

    // console.log(task_where)
    // console.log(user_x_project)
    // console.log(tasks)

    if (!is_user_admin(user_x_project.role) && user.user_id != user_x_project.project.creator_id) throw new CustomError("You are not authorized to perform the action", "09")

    let task_update_data = {
      ...req.body
    }

    if (req.body.user_id) {
      if (!await read_project_x_user(user.user_id, project_id)) throw new CustomError("New user not associated with this project", "09")
    }

    if (req.body.status) {
      if (req.body.status == 'pending' || req.body.status == 'in progress') {
        task_update_data.final_status = 'pending'
        task_update_data.date_completed = null
      }
    }
    if (req.body.final_status) {
      if (req.body.final_status == 'completed') {
        task_update_data.status = 'completed'
        task_update_data.date_completed = new Date()
      }
    }


    //   "user_id",
    //   "title",
    //   "description",
    //   "due_date",
    //   "notes",
    //   "status",
    //   "final_status"

    let update_task_status = await update_task(task_id, project_id, task_update_data)
    if(!update_task_status) throw new CustomError(`Something went wrong`, "09")

    //Fetch task again
    tasks = await read_all_task(task_where)
    if (!tasks) throw new CustomError("Something went wrong", "09")
    tasks = tasks[0]

    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Task updated successfully",
      data: tasks,
    });

  }
  catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}
