
export const authcheck = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new CustomError("Authentication token required", "05");
    next();
  } catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  }
};


export const create_user_task_middleware = async (req, res, next) => {
  try {
    let { title, description, user_id, project_id, due_date } = req.body

    if (!title) throw new CustomError("title required", "02")
    if (!description) throw new CustomError("description required", "02")
    if (!user_id) throw new CustomError("user_id required", "02")
    if (!project_id) throw new CustomError("project_id required", "02")
    if (!due_date) throw new CustomError("due_date required", "02")


    if (!moment(due_date, moment.ISO_8601, true).isValid()) throw new CustomError("Invalid date format. Use Datetime format.", "04");
    const input_date = new Date(due_date);
    if (input_date < new Date()) throw new CustomError("due date cannot be less than current date", "02");
    req.body.due_date = input_date
    // const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/;
    // if(!regex.test(due_date))

    // function isStandardDateTime(dateString) {
    //         return regex.test(dateString);
    // }

    for (const key in req.body) {
      if (typeof req.body[key] == 'string') req.body[key] = req.body[key].toLowerCase().trim()
    }
    next();
  } catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  }
};

export const update_user_task_middleware = async (req, res, next) => {
  try {
    // let {title, description, due_date, notes } = req.body

    // if(!title) throw new CustomError("title required","02")
    // if(!description) throw new CustomError("description required","02")
    // if(!status) throw new CustomError("status required","02")

    const allowedKeys = [
      "user_id",
      "title",
      "description",
      "due_date",
      "notes",
      "status",
      "final_status"
    ]
    for (const key in req.body) {
      if (!allowedKeys.includes(key)) {
        delete req.body[key];
      }
    }

    for (const key in req.body) {
      if (typeof req.body[key] == 'string') req.body[key] = req.body[key].toLowerCase().trim()
    }

    if (req.body.status) {
      let status = req.body.status
      const valid_status = ["pending","in progress", "completed"];
      if (!valid_status.includes(status.toLowerCase())) throw new CustomError(`Invalid status value ${status}`, "02");
    }
    if (req.body.final_status) {
      let final_status = req.body.final_status
      const valid_status = ["in progress", "completed"];
      if (!valid_status.includes(final_status.toLowerCase())) throw new CustomError(`Invalid final_status value ${final_status}`, "02");
    }
    if (req.body.due_date) {
      if (!moment(due_date, moment.ISO_8601, true).isValid()) throw new CustomError("Invalid date format. Use Datetime format.", "04");
      const input_date = new Date(due_date);
      if (input_date < new Date()) throw new CustomError("due date cannot be less than current date", "02");
      req.body.due_date = input_date
    }

    next();
  } catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  }
};

export const update_user_task_status_middleware = async (req, res, next) => {
  try {
    let { task_id, project_id, status } = req.body

    if (!task_id) throw new CustomError("title required", "02")
    if (!project_id) throw new CustomError("project_id required", "02")
    if (!status) throw new CustomError("status required", "02")

    for (const key in req.body) {
      if (typeof req.body[key] == 'string') req.body[key] = req.body[key].toLowerCase().trim()
    }

    const valid_status = ["in progress", "completed"];
    if (!valid_status.includes(status.toLowerCase())) throw new CustomError(`Invalid status value ${status}`, "02");


    next();
  } catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  }
};

