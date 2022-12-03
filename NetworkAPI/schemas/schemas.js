import Joi from 'joi';

const schemas = {    
    '/api/network/follow': Joi.object({
        // authorization: Joi.string().required(),
        uuid: Joi.string().min(3).required(),
        authorization: Joi.string().required(),
    }),

    '/api/network/unfollow': Joi.object({
        // authorization: Joi.string().required(),
        uuid: Joi.string().min(3).required(),
        authorization: Joi.string().required(),
    }),

    '/api/network/list/following': Joi.object({
        // authorization: Joi.string().required(),
        authorization: Joi.string().required(),
    }),

    '/api/network/list/follower': Joi.object({
        // authorization: Joi.string().required(),
        authorization: Joi.string().required(),
    }),
};

export default schemas;

