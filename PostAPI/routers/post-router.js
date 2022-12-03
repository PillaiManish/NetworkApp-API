import express from 'express';
import { addPostAPI, deletePostAPI } from '../controllers/post-controller.js';
import accumulateRequestDataMiddleware from '../middlewares/accumulate-request-data-middleware.js';
import requestParamsValidatorMiddleware from "../middlewares/request-params-validator-middleware.js"
import authenticationValidatorMiddleware from "../middlewares/authentication-validator-middleware.js"

const postRouter = express.Router()

postRouter.post('/add',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], addPostAPI)
postRouter.post('/delete',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], deletePostAPI)

export default postRouter