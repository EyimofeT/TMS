import redis from 'redis';
import { getenv } from './helper.js';

let redisCounter = 0;
let redisClient;

export async function get_redis_client() {
  try {
    // if (!redisClient) {
      redisClient = redis.createClient({
        url: getenv("REDIS_DB")
      });

      // Promisify the connect method to handle connection errors
      const connectAsync = () => new Promise((resolve, reject) => {
        redisClient.on('connect', () => {
          console.log('Connected to Redis server!');
          
          console.log("Active redis connection: " + redisCounter);
          resolve();
        });

        redisClient.on('error', (err) => {
          console.log('Error in the Redis server connection:', err);
          reject(err);
        });

        // Ensure the 'connect' and 'error' events are properly set up before connecting
        redisClient.connect();
      });

      // Wait for the connection to be established
      await connectAsync();
    // }
    redisCounter += 1;

    redisClient.ping();
    return redisClient;
  } catch (err) {
    console.log("Unable to get redis client");
    console.log(err);
    disconnect_redis_client();
    return false;
  }
} 

export async function disconnect_redis_client(rd) {
  try {
    if(!rd) return true
    console.log("Active redis connection before disconnect: " + redisCounter);
    if (redisClient && redisCounter > 0) {
      console.log("Disconnecting redis client");
      await rd.quit();
      redisCounter -= 1;
      console.log("Active redis connection after disconnect: " + redisCounter);
    } else {
      console.log('Redis client is not available or already disconnected.');
    }
  } catch (err) {
    console.log('Error occurred while disconnecting from Redis:', err.message);
  }
}

export async function write_to_redis(key, value, duration){
  let rd =await get_redis_client()
try{

  rd.set(key, JSON.stringify(value), {
    EX: duration || getenv('REDIS_EXPIRY_TIME'), // Set the specified expire time, in seconds.
  });

  // disconnect_redis_client(rd)

  return true;
}
catch(err){
console.log("Something went wrong trying to save to redis : " + err)
return false
}
finally{
  disconnect_redis_client(rd)
}
}

export async function read_from_redis(key){
  // console.log("in get redis")
  let rd =await get_redis_client()
try{

  let data = await rd.get(key)
  // if(!data) return false

  return data
}
catch(err){
console.log("Something went wrong trying to read from redis : " + err)
return false
}
finally{
  disconnect_redis_client(rd)
}
}

export async function delete_from_redis(key){
  let rd =await get_redis_client()
try{

  rd.del(key)

  return true
}
catch(err){
console.log("Something went wrong trying to delete from redis : " + err)
return false
}
finally{
  disconnect_redis_client(rd)
}
}


// export function disconnect_redis_client(){
//     console.log("disconnecting redis client")
//     redisClient.quit((err, reply) => {
//       if (err) {
//         console.error('Error occurred while disconnecting from Redis:', err);
//       } else {
//         console.log('Disconnected from Redis:', reply);
//       }
//     });
//   }



//beta
// const redis = require('redis');
// const { promisify } = require('util');
// import { promisify } from 'util';

// const MAX_POOL_SIZE = 10;
// const redisURL = getenv("REDIS_DB"); // Replace with your Redis server URL

// export async function get_redis_client() {
//   const client =  redis.createClient({
//     url: getenv("REDIS_DB")
//   });
//   // await client.connect();
//   (async () => {
//       await client.connect();
//     })();
//   client.on('error', (err) => {
//     console.error('Error: ', err);
//   });
//   client.on('connect', () => {
//     console.log('Connected to Redis');
//   });
//   client.getAsync = promisify(client.get).bind(client);
//   client.setAsync = promisify(client.set).bind(client);
//   // console.log(client)
//   return client;
// }

// export default get_redis_client;


// export function disconnect_redis_client(){
//   // console.log("in here ")
//   redisClient.quit((err, reply) => {
//     if (err) {
//       console.error('Error occurred while disconnecting from Redis:', err);
//     } else {
//       console.log('Disconnected from Redis:', reply);
//     }
//   });
// }