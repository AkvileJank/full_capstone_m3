import type { DataSourceOptions } from 'typeorm'
import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import logger from './logger'

const database = createDatabase(config.database as DataSourceOptions)

database
  .initialize()
  .then(() => {
    logger.info('Established connection to the database')
    const app = createApp(database)

    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running at http://localhost:${config.port}`)
    })
  })
  .catch((error) => {
    logger.error(error)
  })
