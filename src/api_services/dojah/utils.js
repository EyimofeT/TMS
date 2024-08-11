import { getenv } from "../../core/helper.js";
import axios from "axios";

export async function verify_bvn(bvn, doja_key , doja_app_id){
    const url = getenv("DOJA_LIVE_URL") + "/api/v1/kyc/bvn/advance"
    if(!doja_key) doja_key =  getenv("DOJA_KEY")
    if(!doja_app_id) doja_app_id =  getenv("DOJA_APP_ID")
   const params = {
        "bvn": bvn
    }
    const headers = 
    {
        "Content-Type": "application/json",
        "Authorization": doja_key,
        "AppId":doja_app_id,
    }

    const response = await axios.get(url , {
        params: params,
        headers: headers,
      }) .then((response) => {
        // Handle the API response here
        // console.log('Response:', response.data);
        return response
      })
      .catch((error) => {
        // Handle errors here
        // console.error('Error:', error.message);
        // console.log(error)
        return false
      });

      return response
}

export async function verify_nin(nin, doja_key , doja_app_id){
  const url = getenv("DOJA_LIVE_URL") + "/api/v1/kyc/nin"
  if(!doja_key) doja_key =  getenv("DOJA_KEY")
  if(!doja_app_id) doja_app_id =  getenv("DOJA_APP_ID")
 const params = {
      "nin": nin
  }
  const headers = 
  {
      "Content-Type": "application/json",
      "Authorization": doja_key,
      "AppId":doja_app_id,
  }

  const response = await axios.get(url , {
      params: params,
      headers: headers,
    }) .then((response) => {
      // Handle the API response here
      // console.log('Response:', response.data);
      return response
    })
    .catch((error) => {
      // Handle errors here
      // console.error('Error:', error.message);
      // console.log(error)
      return false
    });

    return response
}