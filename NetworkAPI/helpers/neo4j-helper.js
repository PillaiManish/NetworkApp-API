import driver from '../config/neo4j.js'
import constants from '../config/constants.js';
import neo4j from "neo4j-driver"

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





