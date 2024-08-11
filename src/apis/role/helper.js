let admin_role = 'admin'

export function is_user_admin(role){
    try {
      return admin_role == role
  
    } catch (err) {
      console.log(" Error: "+ err)
      return false;
    } finally {
      
    }
  }