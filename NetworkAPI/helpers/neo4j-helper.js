import neo4j from 'neo4j-driver'
import constants from '../config/constants.js';
const driver = neo4j.driver(constants.dbConfig.dbURI, neo4j.auth.basic(constants.dbConfig.dbUser, constants.dbConfig.dbPassword))

export default (() => {
  return {

    read: async (cypher, params = {}) => {
      const session = driver.session({
          defaultAccessMode: neo4j.session.READ,
          database: 'neo4j',
      })

      let res 
      try {
          res = await session.run(cypher, params)
      }
      catch (e) {
          await session.close()
          throw e
      }

      await session.close()
      return res
    },
    write: async (cypher, params = {}) => {
      const session = driver.session({
          defaultAccessMode: neo4j.session.WRITE,
          database: 'neo4j',
      })

      let res 
      try {
          res = await session.run(cypher, params)
      }
      catch (e) {
          await session.close()
          throw e
      }

      await session.close()
      return res
    },

  };
})();





