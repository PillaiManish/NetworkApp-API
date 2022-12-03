import { okResponse, createdResponse } from "../responses/success-response.js";
import { internalServerErrorResponse, notFoundResponse, unauthorisedResponse } from "../responses/error-response.js";
import constants from "../config/constants.js";
import { addPostService, deletePostService } from "../services/post-service.js";

const addPostAPI = async (req, res) => {
    let addPost;

    try {
        addPost = await addPostService(req.allRequestData, req.uuid);
    }

    catch (err){
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

    return okResponse(res, null, "Added Post successfully.")
}

const deletePostAPI = async (req, res) => {
    let deletePost;

    try {
        deletePost = await deletePostService(req.allRequestData, req.uuid);
    }

    catch (err){
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

    return okResponse(res, null, "Deleted Post successfully.")
}


export {addPostAPI, deletePostAPI}

