import { okResponse, createdResponse } from "../responses/success-response.js";
import { internalServerErrorResponse, notFoundResponse, unauthorisedResponse } from "../responses/error-response.js";
import constants from "../config/constants.js";
import { followService, unfollowService, listOfFollowingService, listOfFollowerService } from "../services/network-service.js";

const followAPI = async (req, res) => {
    let follow;

    try {
        follow = await followService(req.allRequestData, req.uuid);
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

    return okResponse(res, null, "User followed successfully.")
}

const unfollowAPI = async (req, res) => {
    let unfollow;

    try {
        unfollow = await unfollowService(req.allRequestData, req.uuid);
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

    return okResponse(res, null, "User unfollowed successfully.")
}

const listOfFollowingAPI = async (req, res) => {
    let followingList;

    try {
        followingList = await listOfFollowingService(req.allRequestData, req.uuid);
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

    return okResponse(res, followingList, "Following List Displayed successfully.")
}

const listOfFollowerAPI = async (req, res) => {
    let followerList;

    try {
        followerList = await listOfFollowerService(req.allRequestData, req.uuid);
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

    return okResponse(res, followerList, "Following List Displayed successfully.")
}


export {followAPI, unfollowAPI, listOfFollowingAPI, listOfFollowerAPI}

