import express from 'express';
import { loginAPI, registerAPI, checkAuthenticationAPI } from '../controllers/auth-controller.js';
import accumulateRequestDataMiddleware from '../middlewares/accumulate-request-data-middleware.js';
import requestParamsValidatorMiddleware from "../middlewares/request-params-validator-middleware.js"

const authRouter = express.Router()

authRouter.post('/login',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware], loginAPI)
authRouter.post('/register',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware], registerAPI)
authRouter.post('/check',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware], checkAuthenticationAPI)


export default authRouter