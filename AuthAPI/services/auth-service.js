import pgHelper from "../helpers/pg-helper.js";
import logHelper from "../helpers/log-helper.js";
import constants from "../config/constants.js";
import {generateUuid} from "../helpers/common-helper.js";
import jsonwebtoken from "jsonwebtoken";
const logger = logHelper.getInstance({appName: constants.appName});

const loginService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let user
        let query = "SELECT * FROM users where username = $1 and password = $2 ;"
        try {
            user = await pgHelper.triggerQuery(query, [data["username"], data["password"]]);
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to retrieve user',
                traces: [`identifier::${identifier}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        if (user.rows.length == 0){
            logger.error({
                error: new Error('Incorrect Username or Password').toString(),
                errorMessage: new Error('Incorrect Username or Password').message,
                message: 'Failed to authenticate user',
                traces: [`identifier::${identifier}`]
            });
            return reject({error: new Error('Incorrect Username or Password'), type: constants.errorType.UNAUTHORIZED});
        }

        let token = null
        try {
            token = await jsonwebtoken.sign({username:data["username"], uuid: user.rows[0]["uuid"]},constants.JWT.JWT_SECRET_KEY)
        }        
        catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to generate token',
                traces: [`identifier::${identifier}`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }
        
        return resolve(token)
    })
}

const registerService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let query = "INSERT INTO USERS (uuid, username, name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        let newUser = null
        let uuid = generateUuid()
        try {
            newUser = await pgHelper.triggerQuery(query, [uuid, data["username"], data["name"], data["email"], data["password"]]);
        } catch (err) {
            logger.error({
                error: err.toString(),
                errorMessage: err.message,
                message: 'Failed to insert student',
                traces: [`identifier::${identifier}`, `user::Null`]
            });
            return reject({error: err, type: constants.errorType.INTERNAL_SERVER_ERROR});
        }

        return resolve(true)
    })
}

const checkAuthenticationService = (data, identifier) => {
    return new Promise(async (resolve, reject) => {
        let payload = null

        try {
            payload = jsonwebtoken.verify(data.authorization, constants.JWT.JWT_SECRET_KEY)
        } catch (err) {
            logger.error({
                error: new Error('Invalid JWT').toString(),
                errorMessage: new Error('Invalid JWT').message,
                message: 'Given JWT is invalid',
                traces: [`identifier::${identifier}`]
            });

            return reject({error: new Error('Invalid JWT'), type: constants.errorType.FORBIDDEN});
        }

        let uuid = payload.uuid;
        return resolve({uuid:uuid})
    }
)}

export {loginService, registerService, checkAuthenticationService}