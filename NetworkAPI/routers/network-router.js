import express from 'express';
import { followAPI, unfollowAPI, listOfFollowingAPI, listOfFollowerAPI } from '../controllers/network-controller.js';
import accumulateRequestDataMiddleware from '../middlewares/accumulate-request-data-middleware.js';
import requestParamsValidatorMiddleware from "../middlewares/request-params-validator-middleware.js"
import authenticationValidatorMiddleware from "../middlewares/authentication-validator-middleware.js"

const authRouter = express.Router()

authRouter.post('/follow',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], followAPI)
authRouter.post('/unfollow',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], unfollowAPI)
authRouter.post('/list/following',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], listOfFollowingAPI)
authRouter.post('/list/follower',[accumulateRequestDataMiddleware, requestParamsValidatorMiddleware, authenticationValidatorMiddleware], listOfFollowerAPI)


export default authRouter