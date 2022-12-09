import express from 'express';
import loggerHelper from '../helpers/log-helper.js'
import constants from '../config/constants.js';
import amqp from "amqplib"

const app = express();
const logger = loggerHelper.getInstance({appName: constants.appName});


let channel;
let connection;
const amqpServer = 'amqp://localhost:5672'

try {
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    console.log('Connected with RabbitMQ!')    
}
catch(err) {
    console.log('Error in Connection!')
}

export default channel;