import { getenv } from '../../core/helper.js';
import amqp from 'amqplib';
// import { taskHandler } from './taskConsumer.js';

// const rabbitmqUrl = 'amqp://localhost'; // Change to your RabbitMQ URL
const rabbitmqUrl = getenv('RABBITMQ_URL')
let env = getenv('ENV')

const connectRabbitMQ = async (queue) => {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    if(env == 'test') queue = `${queue}-test`

    await channel.assertQueue(queue, { durable: true });

    // console.log("connected queue : "+ queue)
    return { connection, channel, queue };
};

export const sendToQueue = async (task, quote_queue, properties) => {
    if(!properties) properties = { persistent: true }
    if(properties) properties.persistent = true
    const { connection, channel,queue } = await connectRabbitMQ(quote_queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), properties);
    // console.log("Task sent to queue : " + queue)
    // console.log(`Task sent to queue: ${JSON.stringify(task)}`);
    await channel.close();
    await connection.close();
};

export const consumeQueue = async (taskHandler, quote_queue) => {
    // console.log("in consume queue")
    const { connection, channel,queue } = await connectRabbitMQ(quote_queue);
    console.log("Queue : "+ queue)
    channel.consume(queue, async (msg) => {
        if (msg !== null) {    
            try {

                let task
                try {
                    task = JSON.parse(msg.content.toString());
                    await taskHandler(task);
                } catch (e) {
                    console.log("not valid json")
                }finally{
                    channel.ack(msg);
                }
            } catch (error) {
                console.error('Task failed:'+ error);
                channel.nack(msg);
            }
        }
    }, { noAck: false });
};


function process_task(task){
    
    return false
}