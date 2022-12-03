import crypto from 'crypto';

export default function requestIdentifierMiddleware(req, res, next) {
    req.uuid = crypto.randomUUID();
    next();
}