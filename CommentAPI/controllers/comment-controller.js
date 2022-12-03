import { okResponse, createdResponse } from "../responses/success-response.js";
import { internalServerErrorResponse, notFoundResponse, unauthorisedResponse } from "../responses/error-response.js";
import constants from "../config/constants.js";
import { addCommentService, deleteCommentService } from "../services/comment-service.js";

const addCommentAPI = async (req, res) => {
    let addPost;

    try {
        addPost = await addCommentService(req.allRequestData, req.uuid);
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

const deleteCommentAPI = async (req, res) => {
    let deletePost;

    try {
        deletePost = await deleteCommentService(req.allRequestData, req.uuid);
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


export {addCommentAPI, deleteCommentAPI}