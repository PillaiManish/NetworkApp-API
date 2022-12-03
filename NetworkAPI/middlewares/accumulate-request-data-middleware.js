export default function accumulateRequestDataMiddleware(req, res, next) {
    let allRequestData = {};

    const paramTypes = ['query', 'body', 'params'];
    for (const param of paramTypes) {
        if (req[param] && Object.keys(req[param]).length > 0) {
            if (typeof req[param] === 'string') {
                req[param] = JSON.parse(req[param]);
            }
            allRequestData = {...allRequestData, ...req[param]};
        }
    }
    if (req.headers.authorization){
        allRequestData['authorization'] = req.headers.authorization
    }
    req.allRequestData = allRequestData;
    next();
}
