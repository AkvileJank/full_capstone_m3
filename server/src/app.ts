import express from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import { renderTrpcPanel } from 'trpc-panel'
import type { Database } from './database'
import { appRouter } from './modules'
import type { Context } from './trpc'
import logger from './logger'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

export default function createApp(db: Database) {
  const app = express()

  app.use(cors())
  app.use(express.json())

  // Endpoint for health checks - pinging the server to see if it's alive.
  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/api/v1/trpc',
    createExpressMiddleware({
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        db,
        req,
        res,
      }),

      router: appRouter,
      // onError: (options) => {
      //   const { error } = options
      //   logger.error(error)
      //   if (!(error instanceof TRPCError) && !(error instanceof ZodError))
      //     throw new TRPCError({
      //       code: 'INTERNAL_SERVER_ERROR',
      //       message: 'Something went wrong',
      //     })
      // },
    })
  )

  app.use('/panel', (_, res) =>
    res.send(
      renderTrpcPanel(appRouter, {
        url: 'http://localhost:3000/v1/trpc',
        transformer: 'superjson',
      })
    )
  )

  return app
}
