import { router } from '@server/trpc'
import signup from './signup'
import login from './login'
import findJoinedLessons from './findJoinedLessons'

export default router({
  signup,
  login,
  findJoinedLessons
})
