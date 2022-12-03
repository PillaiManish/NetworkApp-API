import Joi from 'joi';

const schemas = {
    '/api/auth/login': Joi.object({
        // authorization: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(3)
    }),
    
    '/api/auth/register': Joi.object({
        // authorization: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(3).required(),
        name: Joi.string().required(),
        email: Joi.string().required(),
    }),
};

export default schemas;

