import express from "express";
import cors from "cors";
import moment from "moment";
import { getenv } from "./src/core/helper.js";
import authRouter from "./src/apis/auth/routes.js"
import userRouter from "./src/apis/user/routes.js"
import projectRouter from "./src/apis/project/routes.js"
import dashboardRouter from "./src/apis/dashboard/routes.js"
import taskRouter from "./src/apis/task/routes.js"
import messageRouter from "./src/apis/message/routes.js"
import { is_request_empty } from "./src/apis/utils/utility.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import { CustomError } from "./src/core/customerror.js";
// import { check_access } from "./src/apis/device/deviceaccessmanagement.js";
global.CustomError = CustomError
global.rd = false
global.getenv = getenv
global.moment = moment
global.is_request_empty = is_request_empty

const app = express();

//For getting data from the frontend as json format
app.use(express.json());

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//trying to make api request from front end
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);


// Logging middleware to log to CLI
app.use(morgan("combined"));

// app.use(check_access);

//all auth routers
app.use(`${getenv("BASE_URL")}auth`, authRouter);

//all user routes
app.use(`${getenv("BASE_URL")}user`, userRouter);

//all project routes
app.use(`${getenv("BASE_URL")}project`, projectRouter);

//all dashboard routes
app.use(`${getenv("BASE_URL")}dashboard`,dashboardRouter);

//all task routes
app.use(`${getenv("BASE_URL")}task`,taskRouter);

app.use(`${getenv("BASE_URL")}message`,messageRouter);

app.get("/", (req, res) => {
  return res.status(200).json({
    code: 200,
    status: "success",
    message: 'TMS Service up and running',
    update : getenv('Updated')
  }); 
})

// Catch-all route for non-existing endpoints
app.use((req, res) => {
  return res.status(404).json({
    code: 404,
    responseCode : "99",
    status: "failed",
    message: 'Endpoint not found',
    error: "An Error Occured!",
  });
});

const port = 8080 || getenv("API_PORT") 
app.listen(port, () => console.log("SERVER LISTENING ON PORT: " + port));
