import express from 'express';
import { addCommentAPI, deleteCommentAPI } from '../controllers/comment-controller.js';
import accumulateRequestDataMiddleware from '../middlewares/accumulate-request-data-middleware.js';
import requestParamsValidatorMiddleware from "../middlewares/request-params-validator-middleware.js"
import authenticationValidatorMiddleware from "../middlewares/authentication-validator-middleware.js"

const commentRouter = express.Router()

commentRouter.post('/add',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], addCommentAPI)
commentRouter.post('/delete',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], deleteCommentAPI)

export default commentRouter