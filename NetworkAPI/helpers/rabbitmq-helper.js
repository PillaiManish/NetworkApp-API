import loggerHelper from './log-helper.js';
import constants from '../config/constants.js';
import amqp from "amqplib"
import { createUserService } from '../services/network-service.js';

const logger = loggerHelper.getInstance({appName: constants.appName});

export default (() => {
    
    let channel
    async function createInstance(){
        try {
            let amqpServer = "amqp://rabbit:5672"
            let connection = await amqp.connect(amqpServer)
            channel = await connection.createChannel()
            console.log('Connected with RabbitMQ!')    
        }
        catch(err) {
            console.log('Error in Connection!', err)
            throw err
        }
    }

    return {
        setUpConnectionPool: async () => {
            if (!channel) {
                try {
                    await createInstance();
                } catch (err) {
                    throw err;
                }
            }
        },

        readData: async (channelName, data) => {
            if (!channel) {
                try {
                    await createInstance();
                } catch (err) {
                    throw err;
                }
            }

            try {
                await channel.assertQueue(channelName)
                await channel.consume(channelName, data => {
                    if (channelName == 'createNewUser'){
                        createUserService(JSON.parse(data.content))
                    }
                    channel.ack(data);
                })
            }
            catch (err){
                console.log("Error",err)
                // throw err
            }

        },

        sendData: async (channelName, data) => {
            if (!channel) {
                try {
                    createInstance();
                } catch (err) {
                    throw err;
                }
            }
            
            try {
                await channel.assertQueue(channelName)
                await channel.sendToQueue(channelName, Buffer.from(JSON.stringify(data)));
            }
            catch (err){
                console.log("Error",err)
            }
        },
    };
})();
