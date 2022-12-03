import schemas from '../schemas/schemas.js';

const validateSchema = (type, data) => {

    if (!schemas[type]) {
        return true;
    }

    const validated = schemas[type].validate(data);

    if (validated.error && validated.error.details) {
        throw new Error(formatErrorMessages(validated.error.details));
    } else {
        return validated.value;
    }
};

const formatErrorMessages = (errorDetails) => {
    let allErrors = ''
    for (const error of errorDetails) {
        allErrors += error.message + '\n';
    }
    return allErrors;
}

export default validateSchema;
