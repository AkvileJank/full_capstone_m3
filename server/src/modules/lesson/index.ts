import { router } from '@server/trpc'
import create from './create'
import findAll from './findAll'
import remove from './remove'
import update from './update'
import join from './join'
import findById from './findById'
import isJoined from './isJoined'
import isOwned from './isOwned'
import findAttendingUsers from './findAttendingUsers'
import removeFromLesson from './removeFromLesson'

export default router({
  create,
  findAll,
  remove,
  update,
  join,
  findById,
  isOwned,
  isJoined, // for button switch between join and remove me from lesson??
  findAttendingUsers,
  removeFromLesson,
})
