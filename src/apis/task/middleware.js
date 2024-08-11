
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


export const create_user_task_middleware = async (req, res, next) => {
  try {
    let {title, description, user_id, project_id, due_date } = req.body

    if(!title) throw new CustomError("title required","02")
    if(!description) throw new CustomError("description required","02")
    if(!user_id) throw new CustomError("user_id required","02")
    if(!project_id) throw new CustomError("project_id required","02")
    if(!due_date) throw new CustomError("due_date required","02")


    if(!moment(due_date,moment.ISO_8601,true).isValid())  throw new CustomError("Invalid date format. Use Datetime format.", "04");
    const input_date = new Date(due_date);
    if(input_date < new Date()) throw new CustomError("due date cannot be less than current date", "02");
    req.body.due_date = input_date
    // const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/;
    // if(!regex.test(due_date))

    // function isStandardDateTime(dateString) {
    //         return regex.test(dateString);
    // }
    
  for(const key in req.body){
    if(typeof  req.body[key]  == 'string')  req.body[key] = req.body[key].toLowerCase().trim()
  }
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



//   task_id                String         @unique
//   title                  String
//   description            String?
//   status                 String         @default("pending") // Example statuses: pending, IN_PROGRESS, COMPLETED
//   due_date               DateTime?
//   user_id                String
//   project_id             String
//   assigned_by_user_entry String