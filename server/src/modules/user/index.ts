import { router } from '@server/trpc'
import signup from './signup'
import login from './login'
import findJoinedLessons from './findJoinedLessons'
import findOwned from './findOwned'

export default router({
  signup,
  login,
  findJoinedLessons,
  findOwned,
})
