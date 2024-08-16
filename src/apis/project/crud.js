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
const project_obj = {
  project_id: true,
  project_photo: true,
  name: true,
  description: true,
  created_at: true,
  updated_at: true,
  creator :{
    select : {
      user_id:true,
      first_name:true,
      last_name:true,
      email:true,
      phone:true,
      profile_photo:true
    }
  },
  users: {
    select: {
      role:true,
      entry_id:true,
      assignedAt:true,
      user: {
        select: {
          user_id:true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          profile_photo: true
        }
      }
    }
  },
  tasks:{
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
          description: true
        }
      },
      assigned_by_user: {
        select: {
          user: {
            select: {
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
  }
  
}

export async function create_project(user_id, name, description, project_id, entry_id, photo) {
  try {

    const save_data = await prisma.$transaction(async (prisma) => {
      let project = await prisma.project.create({
        data: {
          project_id,
          name,
          description,
          creator_id: user_id,
          project_photo : photo || null
        }
      })

      let project_x_user = await prisma.project_x_user.create({
        data: {
          entry_id,
          user_id,
          project_id,
          role: 'admin'
        }
      })

      return { project, project_x_user }
    }, { timeout: transaction_timeout });

    return save_data
  }
  catch (err) {
    console.log("Error while trying to create project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function read_user_project_by_user_id(user_id) {
  try {

    // let project = await prisma.project_x_user.findMany({
    //   where: {
    //     user_id
    //   },
    //   select: project_obj
    // })
    let project = await prisma.project.findMany({
      where: {
        users: {
          some: {
            user_id: user_id,
          },
        },
      },
      select: project_obj

    })

    return project

  }
  catch (err) {
    console.log("Error while trying to read user project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function read_user_project_by_user_id_project_id(user_id, project_id) {
  try {

    // let project = await prisma.project_x_user.findFirst({
    //   where: {
    //     user_id,
    //     project_id
    //   },
    //   select: project_obj
    // })
    let project = await prisma.project.findFirst({
      where:  {
        users: {
          some: {
            user_id,
            project_id
          },
        },
      },
      select: project_obj
    })

    if (!project) return false
    return project

  }
  catch (err) {
    console.log("Error while trying to read user project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}


export async function read_project_x_user(user_id, project_id) {
  try {

    let project = await prisma.project_x_user.findFirst({
      where: {
        user_id,
        project_id
      },
      include:{
        project:true
      }
    })
    if(!project) return false
    
    return project

  }
  catch (err) {
    console.log("Error while trying to read user project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function add_user_to_project(data){
  try{

    let project_data = await prisma.project_x_user.create({
        data: data
      })

      return project_data

  }
  catch (err) {
    console.log("Error while trying to add user to project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }

}

export async function delete_user_from_project(user_id, project_id){
  try{

    let project_data = await prisma.project_x_user.deleteMany({
      where:{
        user_id,
        project_id
      }
    })
      return project_data

  }
  catch (err) {
    console.log("Error while trying to add user to project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }

}

export async function update_project_x_user(where, data){
  try {

    let user_data = await prisma.project_x_user.update({
      where,
      data
    })
    return user_data
  }
  catch (err) {
    console.log("Error while trying to update project_x_user: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function update_project(project_id,data){
  try {

    let user_task = await prisma.project.update({
      where:{
        project_id
      },
      data
    })
    return user_task
  }
  catch (err) {
    console.log("Error while trying to update project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}
