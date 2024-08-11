import axios from "axios";
export async function send_post_request(url, data, headers = {}) {
    try {
    const response = await axios.post(url, data, { headers });
    //console.log('Response:', response.data);
      return response.data; 
    } catch (error) {
      console.log(error)
      return false
      } 
  }

  export async function send_get_request(url, headers = {}) {
    try {
      const response = await axios.post(url, { headers });
      return response.data; 
    } catch (error) {
      console.log(error)
          return false
      }
  }

  export async function send_patch_request(url, data, headers = {}) {
    try {
      const response = await axios.patch(url, data, { headers });
      return response.data; 
    } catch (error) {
      console.log(error)
        //   return {
        //     status : 200,
        //     data :{
        //     code : 400,
        //     status: 'failed',
        //     responseCode: "99",
        //     message: 'Service temporarily unavailable',
        //     error: "An Error Occured!"
    
        //   }
        // }
      }
     
    
  }