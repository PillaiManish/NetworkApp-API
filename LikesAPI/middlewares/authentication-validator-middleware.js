import constants from "../config/constants.js";
import logHelper from "../helpers/log-helper.js";
import {
    unauthorisedResponse,
    internalServerErrorResponse,
    badRequestResponse,
    unauthenticatedResponse
} from '../responses/error-response.js';
import httpStatusCodes from 'http-status-codes';

const logger = logHelper.getInstance({appName: constants.appName});
import axios from "axios";


export default async function authenticationValidatorMiddleware(req, res, next) {

    if (!req.allRequestData.authorization) {
        logger.error({
            message: 'Unauthenticated Access', traces: [`uuid::${req.uuid}`,],
        });
        return unauthenticatedResponse(res, 'Unauthenticated Access', null);
    }
    try {
        const response = await axios.post(constants.endPoint.authCheckAuthentication,{}, {
            headers: {
                'Authorization': req.allRequestData.authorization
            }
        } )

        req.allRequestData["current_user_uuid"] = response.data.result.data.uuid;
    }
    
    catch (err){
        if(err.response.status === httpStatusCodes.UNAUTHORIZED){
            logger.error({
                error: err.toString(),
                errorMessage: err.message, message: 'Unauthorized Access', traces: [`uuid::${req.uuid}`,],
            });
            return unauthorisedResponse(res, 'Unauthorized Access', err);
        } else if (err.response.status === httpStatusCodes.FORBIDDEN) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message, message: 'Unauthenticated Access', traces: [`uuid::${req.uuid}`,],
            });
            return unauthenticatedResponse(res, 'Unauthenticated Access', err);
        } else if (err.response.status === httpStatusCodes.INTERNAL_SERVER_ERROR) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message, message: 'Internal Server Error', traces: [`uuid::${req.uuid}`,],
            });
            return internalServerErrorResponse(res, 'Internal Server Error', err);
        } else {
            logger.error({
                error: err.toString(),
                errorMessage: err.message, message: 'Bad Request', traces: [`uuid::${req.uuid}`,],
            });
            return badRequestResponse(res, 'Bad Request', err);
        }
    }
    next()
}
