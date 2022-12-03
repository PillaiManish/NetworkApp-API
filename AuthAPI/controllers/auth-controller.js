import { okResponse, createdResponse } from "../responses/success-response.js";
import { internalServerErrorResponse, notFoundResponse, unauthorisedResponse, unauthenticatedResponse } from "../responses/error-response.js";
import constants from "../config/constants.js";
import { loginService, registerService, checkAuthenticationService } from "../services/auth-service.js";

const loginAPI = async (req, res) => {
    let token = null

    try {
        token = await loginService(req.allRequestData, req.uuid)
    }

    catch (err) {
        console.log(err)
        if (err.type === constants.errorType.INTERNAL_SERVER_ERROR) {
            return internalServerErrorResponse(res, err.error.message, err.error);
        } 
        else if (err.type === constants.errorType.UNAUTHORIZED) {
            return unauthorisedResponse(res, err.error.message, err.error);
        }
        else {
            return notFoundResponse(res, err.error.message, err.error);
        }
    }

    return okResponse(res, token, "User logged in successfully.")
}

const registerAPI = async (req, res) => {
    let token = null

    try {
        token = await registerService(req.allRequestData, req.uuid)
    }

    catch (err) {
        console.log(err)
        if (err.type === constants.errorType.INTERNAL_SERVER_ERROR) {
            return internalServerErrorResponse(res, err.error.message, err.error);
        } 
        else if (err.type === constants.errorType.UNAUTHORIZED) {
            return unauthorisedResponse(res, err.error.message, err.error);
        }
        else {
            return notFoundResponse(res, err.error.message, err.error);
        }
    }

    return okResponse(res, token, "User registered successfully.")
};

const checkAuthenticationAPI = async (req, res) => {
    let userDetail
    try {
        userDetail = await checkAuthenticationService(req.allRequestData, req.uuid)
    } catch (err) {
        if(err.type  === constants.errorType.UNAUTHORIZED){
            return unauthorisedResponse(res, err.error, err.error)
        } 
        else if (err.type === constants.errorType.FORBIDDEN){
            return unauthenticatedResponse(res, err.error, err.error)
        }
        else{
            return internalServerErrorResponse(res, err.error, )   
        }
    }
    return okResponse(res, userDetail, 'User is authenticated.');

}

export {loginAPI, registerAPI, checkAuthenticationAPI}