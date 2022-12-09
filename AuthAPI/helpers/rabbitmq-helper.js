import channel from "../config/rabbitmq.js";
import loggerHelper from './log-helper.js';
import constants from '../config/constants.js';

const logger = loggerHelper.getInstance({appName: constants.appName});

export default (() => {
    return {
        sendData: async (channelName, data) => {
            await channel.assertQueue(channelName)

            await channel.sendToQueue(channelName, Buffer.from(JSON.stringify(data)));

            await channel.close()
        },
    };
})();
