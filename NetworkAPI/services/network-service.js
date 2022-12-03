import pgHelper from "../helpers/pg-helper.js";
import logHelper from "../helpers/log-helper.js";
import constants from "../config/constants.js";
import {generateUuid} from "../helpers/common-helper.js";
import jsonwebtoken from "jsonwebtoken";
import neo4jHelper from "../helpers/neo4j-helper.js";

const logger = logHelper.getInstance({appName: constants.appName});

const formatRespone = (resultObj)=> {
    const result = [];
    if (resultObj.records.length > 0) {
      resultObj.records.map(record => {
        result.push(record._fields);
      });
    }
    return result;
}
  
const followService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let query
        let params

        params = {
            currentUserUuid: data["current_user_uuid"],
            followUserUuid: data['uuid']
        };

        query = 'RETURN EXISTS ( (:User {uuid:$currentUserUuid})-[:Follows]->(:User {uuid:$followUserUuid}) )'
        let isAlreadyFollowing
        try {
            isAlreadyFollowing = await neo4jHelper.read(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to follow user',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        isAlreadyFollowing = formatRespone(isAlreadyFollowing)

        if (!isAlreadyFollowing[0][0]){
            query = 'MATCH (currentUser:User), (followUser:User) where currentUser.uuid = $currentUserUuid and followUser.uuid = $followUserUuid  CREATE (currentUser)-[r:Follows]->(followUser) RETURN type(r)'

            let newFollow = null
            try {
                newFollow = await neo4jHelper.write(query, params)
            } catch (err) {
                logger.error({
                    error: err.toString(),
                    errorMessage: err.message,
                    message: 'Failed to follow user',
                    traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
                });
                return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
            }

        }
        return resolve(true)

    })
}

const unfollowService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let query
        let params

        params = {
            currentUserUuid: data["current_user_uuid"],
            unfollowUserUuid: data['uuid']
        };

        query = 'RETURN EXISTS ( (:User {uuid:$currentUserUuid})-[:Follows]->(:User {uuid:$unfollowUserUuid}) )'
        let isFollowing
        try {
            isFollowing = await neo4jHelper.read(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to unfollow user',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        isFollowing = formatRespone(isFollowing)
        if (isFollowing[0][0]){
            query = 'MATCH (currentUser:User)-[r:Follows]->(unfollowUser:User) where currentUser.uuid=$currentUserUuid and unfollowUser.uuid=$unfollowUserUuid DELETE r'

            let newFollow = null
            try {
                newFollow = await neo4jHelper.write(query, params)
            } catch (err) {
                logger.error({
                    error: err.toString(),
                    errorMessage: err.message,
                    message: 'Failed to follow user',
                    traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
                });
                return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
            }

        }
        return resolve(true)
    })
}

const listOfFollowingService = (data, identifier)=> {
    return new Promise(async (resolve, reject) => {
        let query
        let params

        query = 'MATCH (currentUser:User)-[r:Follows]->(followingUser:User) where currentUser.uuid=$currentUserUuid return followingUser.uuid, followingUser.username'
        params = {
            currentUserUuid: data["current_user_uuid"],
        };

        let followingList
        try {
            followingList = await neo4jHelper.read(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to follow user',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        followingList = formatRespone(followingList)
        return resolve({'followingList': followingList})
    })
}

const listOfFollowerService = (data, identifier)=>{
    return new Promise(async (resolve, reject) => {
        let query
        let params

        query = 'MATCH (followerUser:User)-[r:Follows]->(currentUser:User) where currentUser.uuid=$currentUserUuid return followerUser.uuid, followerUser.username'
        params = {
            currentUserUuid: data["current_user_uuid"],
        };

        let followingList
        try {
            followingList = await neo4jHelper.read(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to follow user',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        followingList = formatRespone(followingList)
        return resolve({'followingList': followingList})
    })    
}

export {followService, unfollowService, listOfFollowingService, listOfFollowerService}