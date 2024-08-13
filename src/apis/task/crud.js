import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});
const transaction_timeout = 60000


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
      select: {
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
      },
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
