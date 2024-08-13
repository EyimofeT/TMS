import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek } from 'date-fns';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});
const transaction_timeout = 60000
let task_obj = {
  user_id: true,
  task_id: true,
  title: true,
  description: true,
  status: true,
  due_date: true,
  date_completed :true,
  project_id: true,
  assigned_by_user_entry: true,
  notes: true,
  final_status: true,
  created_at: true,
  updated_at: true,
  project: {
    select: {
      name: true,
      description: true,
      project_photo:true
    }
  },
  assigned_by_user: {
    select: {
      user: {
        select: {
          user_id:true,
          first_name: true,
          last_name: true,
          profile_photo: true,
          phone: true,
          email: true
        }
      }
    }
  },
  messages: true
}

export async function create_task(task_data) {
  try {

    let user_task = await prisma.task.create({
      data: task_data
    })

    console.log(user_task)
    return user_task
  }
  catch (err) {
    console.log("Error while trying to create task: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

// export async function read_all_task_by_project_id_user_id(user_id, project_id){
//   try{

//     let user_task = await prisma.task.findMany({
//       where:{
//         user_id,
//         project_id
//       },
//       select : {
//         task_id :true,
//         title :true,
//         description:true,
//         status:true,
//         due_date:true,
//         project_id:true,
//         assigned_by_user_entry:true,
//         notes:true,
//         final_status:true,
//         created_at :true,
//         updated_at :true,
//         messages:true,
//         assigned_by_user :{
//           select :{
//             user:{
//               select : {
//                 first_name:true,
//                 last_name:true,
//                 profile_photo:true,
//                 phone:true,
//                 email:true
//               }
//             }
//           }
//         }

//       }
//     })

//   console.log(user_task)
//   return user_task
//   }
//   catch (err) {
//     console.log("Error while trying to create task: " + err)
//     return false
//   } finally {
//     await prisma.$disconnect();
//   }
// }
export async function read_all_task(where) {
  try {

    let user_task = await prisma.task.findMany({
      where,
      select: task_obj,
      orderBy : {
        created_at : "desc"
      }
    })

    // console.log(user_task)
    return user_task
  }
  catch (err) {
    console.log("Error while trying to read task: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function update_task(task_id,project_id,data){
  try {

    let user_task = await prisma.task.updateMany({
      where:{
        task_id,
        project_id
      },
      data
    })
    return user_task
  }
  catch (err) {
    console.log("Error while trying to update task: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function delete_task(task_id,project_id){
  try {

    let user_task = await prisma.task.deleteMany({
      where:{
        task_id,
        project_id
      }
    })
    return user_task
  }
  catch (err) {
    console.log("Error while trying to delete task: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function task_data(user_id){
try {
  const current_date = new Date();
  let total_number_of_task = await prisma.task.count({
    where:{
      user_id
    }
  })
  let total_number_of_pending_task = await prisma.task.count({
    where:{
      user_id,
      status:'pending'
    }
  })
  let total_number_of_in_progress_task = await prisma.task.count({
    where:{
      user_id,
      status:'in progress'
    }
  })
  let total_number_of_completed_task = await prisma.task.count({
    where:{
      user_id,
      status:'completed'
    }
  })

  let due_tasks = await prisma.task.findMany({
    where:{
      user_id,
      due_date: {
        gt: current_date, // Only tasks with a due_date greater than the current date
      },
      status: {
        not: 'completed', // Exclude tasks where status is 'COMPLETED'
      },
    },
    orderBy: {
      due_date: 'asc', // Order tasks by due_date in ascending order
    },
    select: task_obj
  })

// Get the start and end of the current week
const start_of_current_week = startOfWeek(current_date, { weekStartsOn: 0 }); // Assuming the week starts on Monday
const end_of_current_week = endOfWeek(current_date, { weekStartsOn: 0 });

const completed_tasks_count = await prisma.task.count({
  where: {
    status: 'completed',
    OR: [
      {
        date_completed: {
          gte: start_of_current_week,
          lte: end_of_current_week,
        },
      },
      {
        date_completed: null,
        due_date: {
          gte: start_of_current_week,
          lte: end_of_current_week,
        },
      },
    ],
  },
});

const tasks_due_this_week_count = await prisma.task.count({
  where: {
    status: {
      not: 'completed', // Exclude tasks where status is 'COMPLETED'
    },
    due_date: {
      gte: start_of_current_week, // Tasks due on or after the start of the week
      lte: end_of_current_week,   // Tasks due on or before the end of the week
    },
  },
});

  return {total_number_of_task, total_number_of_pending_task, total_number_of_in_progress_task, total_number_of_completed_task,due_tasks, completed_tasks_count, tasks_due_this_week_count}
}
catch (err) {
  console.log("Error while trying to get task data: " + err)
  return false
} finally {
  await prisma.$disconnect();
}
}
