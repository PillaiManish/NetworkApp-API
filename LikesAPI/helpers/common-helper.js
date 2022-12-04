import crypto from 'crypto';

const generateUuid = () => {
    return crypto.randomUUID();
}

export {generateUuid};
