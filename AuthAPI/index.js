import express from 'express';
import constants from './config/constants.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import authRouter from './routers/auth-router.js';
import multer from 'multer';
import pgHelper from './helpers/pg-helper.js';
import rabbitmqHelper from './helpers/rabbitmq-helper.js';
import loggerHelper from './helpers/log-helper.js';

const logger = loggerHelper.getInstance({appName: constants.appName});

import requestIdentifierMiddleware from './middlewares/request-identifier-middleware.js';

const app = express()

// Middlewares
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(multer().array())
app.use(requestIdentifierMiddleware)

// Routes
app.use('/api/auth', authRouter)

// const verifyUser = await jwt.verify(token,"thisisacollegecentralizedportal")
// console.log(verifyUser)

// Dependencies
try {
  pgHelper.setUpConnectionPool();
} catch (err) {
  logger.error({
      error: err.toString(),
      message: 'Failed to setUpConnectionPool',
  });
  process.exit(0);
}


try {
  rabbitmqHelper.sendData(constants.queue.createNewUser, 324)
} catch (err) {
  logger.error({
      error: err.toString(),
      message: 'Failed to setUpConnectionPool',
  });
  process.exit(0);
}


app.listen(constants.port, () => {
  console.log(`Listening on port ${constants.port}`)
})