import validateSchema from '../helpers/joi-schema-validation-helper.js';
import logHelper from "../helpers/log-helper.js";
import constants from "../config/constants.js";
import {badRequestResponse} from '../responses/error-response.js';

const logger = logHelper.getInstance({appName: constants.appName});

export default function requestParamsValidatorMiddleware(req, res, next) {
    const allParams = req.allRequestData;
    const routerPathKey = req.baseUrl + req.route.path;
    let schemaResult;

    try {
        schemaResult = validateSchema(routerPathKey, allParams);
    } catch (err) {
        logger.error({
            error: err.toString(),
            errorMessage: err.message, message: 'Invalid request params provided', traces: [`uuid::${req.uuid}`,],
        });
        return badRequestResponse(res, 'Invalid request params provided', err);
    }
    next();
}
