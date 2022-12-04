import neo4j from "neo4j-driver"
import constants from "./constants.js";

const uri = constants.dbConfig.dbURI;
const user = constants.dbConfig.dbUser;
const password = constants.dbConfig.dbPassword;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 2 * 60 * 1000, // 120 seconds
  disableLosslessIntegers: true
});

export default driver