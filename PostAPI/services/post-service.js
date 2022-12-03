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
  
const addPostService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let query
        let params

        // Create Post Node
        query = 'CREATE (n:Post {uuid: $postUuid, content: $postContent, createdAt: $createdAt, updatedAt: $updatedAt}) RETURN n'
        let postUuid = generateUuid()
        params = {
            postUuid: postUuid,
            postContent: data.content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        let createNewPost
        try {
            createNewPost = await neo4jHelper.write(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to create new post',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        // Create relation from User->Post
        query = 'MATCH (currentUser:User), (userPost:Post) where currentUser.uuid = $currentUserUuid and userPost.uuid = $postUuid  CREATE (currentUser)-[r:Owns]->(userPost) RETURN type(r)'
        params = {
            currentUserUuid: data.current_user_uuid,
            postUuid: postUuid,
            postContent: data.content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        let userOwnsPost = null
        try {
            userOwnsPost = await neo4jHelper.write(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to follow user',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }


        // Create a relation from Post->User
        query = 'MATCH (userPost:Post), (currentUser:User) where currentUser.uuid = $currentUserUuid and userPost.uuid = $postUuid  CREATE (userPost)-[r:Owned_By]->(currentUser) RETURN type(r)'
        params = {
            currentUserUuid: data.current_user_uuid,
            postUuid: postUuid,
            postContent: data.content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        let postOwnedBy = null
        try {
            postOwnedBy = await neo4jHelper.write(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to follow user',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        return resolve(true)
    })
}


const deletePostService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let query
        let params

        // Check if post exists and also current user is owner of post



        // Check if Post Exists
        // query = 'RETURN EXISTS ( (:User {uuid:$currentUserUuid})-[:Follows]->(:User {uuid:$followUserUuid}) )'
        
        // let isAlreadyFollowing
        // try {
        //     isAlreadyFollowing = await neo4jHelper.read(query, params)
        // } catch (err) {
        //     logger.error({
        //         error: err.toString(),
        //         errorMessage: err.message,
        //         message: 'Failed to follow user',
        //         traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
        //     });
        //     return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        // }

        // isAlreadyFollowing = formatRespone(isAlreadyFollowing)

        // if (!isAlreadyFollowing[0][0]){
        //     query = 'MATCH (currentUser:User), (followUser:User) where currentUser.uuid = $currentUserUuid and followUser.uuid = $followUserUuid  CREATE (currentUser)-[r:Follows]->(followUser) RETURN type(r)'

        //     let newFollow = null
        //     try {
        //         newFollow = await neo4jHelper.write(query, params)
        //     } catch (err) {
        //         logger.error({
        //             error: err.toString(),
        //             errorMessage: err.message,
        //             message: 'Failed to follow user',
        //             traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
        //         });
        //         return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        //     }

        // }

        // Create Post Node
        query = 'MATCH (deletePost:Post) where deletePost.uuid=$postUuid detach delete deletePost'
        params = {
            postUuid: data.uuid,
        };
        
        let deletePost
        try {
            deletePost = await neo4jHelper.write(query, params)
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to delete the post',
                traces: [`identifier::${identifier}`, `user::${data['uuid']}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        // Have to add to delete comment and likes

        return resolve(true)
    })
}


export {addPostService, deletePostService}