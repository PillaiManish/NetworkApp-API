import Joi from 'joi';

const schemas = {    
    '/api/post/add': Joi.object({
        authorization: Joi.string().required(),
        content: Joi.string().required(),
        postUuid: Joi.string().required()
    }),

    '/api/post/delete': Joi.object({
        authorization: Joi.string().required(),
        uuid: Joi.string().required()
    }),
};

export default schemas;

