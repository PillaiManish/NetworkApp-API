import dotenv from 'dotenv';

const defaultEnv = 'dev';
const defaultPort = 1111;
dotenv.config({path: process.cwd() + '/.env'});


const constants = {
    port: process.env.PORT || defaultPort,
    appName: process.env.APP_NAME,
    dbConfig: {
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD,
        dbURI: process.env.DB_URI,
        dbName: process.env.DB_NAME,
    },
    // redisConfig: {
    //     redisUsername: '',
    //     redisPassword: '',
    //     redisHost: process.env.REDIS_HOST,
    //     redisPort: process.env.REDIS_PORT,
    // },
    // redisKeys: {
    //     studentDetailPrefix: `ygo_stats_user:user_details:`,
    //     userPermissionPrefix: 'ygo_stats_user_permissions:permissions:',
    //     userOtpDataPrefix: 'ygo_stats_user_otp_data:',
    // },
    errorType: {
        INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        BAD_REQUEST: 'BAD_REQUEST',
        UNAUTHORIZED: 'UNAUTHORIZED',
        FORBIDDEN: 'FORBIDDEN'
    },
    JWT: {
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
    },
    endPoint: {
        authApi: process.env.AUTH_BASE_URL,
        authCheckAuthentication: process.env.AUTH_BASE_URL + "/api/auth/check"
    }
};

export default constants;
