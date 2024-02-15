import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import type { DataSourceOptions } from 'typeorm'

const database = createDatabase(config.database as DataSourceOptions)

database.initialize().then(() => {
  const app = createApp(database)

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://localhost:${config.port}`)
  })
})
