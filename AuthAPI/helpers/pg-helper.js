import Pool from 'pg-pool';
import pg from 'pg';
import express from 'express';
import loggerHelper from './log-helper.js';
import constants from '../config/constants.js';

const {Client} = pg;

const app = express();
const logger = loggerHelper.getInstance({appName: constants.appName});

export default (() => {

    let pgPool;

    function createInstance() {
        try {
            pgPool = new Pool({
                user: constants.dbConfig.dbUser,
                host: constants.dbConfig.dbHost,
                database: constants.dbConfig.dbName,
                password: constants.dbConfig.dbPassword,
                port: constants.dbConfig.dbPort,
                max: constants.dbConfig.dbMaxConn,
                maxUses: constants.dbConfig.dbMaxConnUses,
            });
            logger.info({message: 'Connection pool to database created'});
        } catch (err) {
            logger.error({message: err.message});
            throw err;
        }
    }

    return {
        setUpConnectionPool: () => {
            if (!pgPool) {
                try {
                    createInstance();
                } catch (err) {
                    throw err;
                }
            }
        },
        getStandAloneClient: async () => {
            let client;
            try {
                client = new Client({
                    user: constants.dbConfig.dbUser,
                    host: constants.dbConfig.dbHost,
                    database: constants.dbConfig.dbName,
                    password: constants.dbConfig.dbPassword,
                    port: constants.dbConfig.dbPort,
                })
                client.connect();
            } catch (err) {
                logger.error({message: err.message});
                throw err;
            }
            return client;
        },
        triggerQuery: async (query, dataArray) => {
            if (!pgPool) {
                try {
                    createInstance();
                } catch (err) {
                    throw err;
                }
            }
            let client;
            try {
                client = await pgPool.connect();
            } catch (err) {
                logger.error({message: err.message});
                throw err;
            }

            logger.info({
                message: 'Triggering db query', data: {
                    query, dataArray,
                },
            });

            let queryResult;
            try {
                queryResult = await client.query(query, dataArray);
            } catch (err) {
                client.release();
                logger.error({message: err.message});
                throw err;
            }
            client.release();
            return queryResult;
        }
    };
})();
