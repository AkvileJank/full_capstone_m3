import { router } from '../trpc'
import user from './user'
import lesson from './lesson'

export const appRouter = router({
  user,
  lesson,
})

export type AppRouter = typeof appRouter
