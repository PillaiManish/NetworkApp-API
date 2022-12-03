import express from 'express';
import constants from './config/constants.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import postRouter from './routers/post-router.js';
import multer from 'multer';
import pgHelper from './helpers/pg-helper.js';
import requestIdentifierMiddleware from './middlewares/request-identifier-middleware.js';

const app = express()

// Middlewares
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(multer().array())
app.use(requestIdentifierMiddleware)

// Routes
app.use('/api/post', postRouter)


// Dependencies
// try {
//   pgHelper.setUpConnectionPool();
// } catch (err) {
//   logger.error({
//       error: err.toString(),
//       message: 'Failed to setUpConnectionPool',
//   });
//   process.exit(0);
// }

app.listen(constants.port, () => {
  console.log(`Listening on port ${constants.port}`)
})