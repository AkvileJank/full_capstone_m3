import { router } from '@server/trpc'
import create from './create'
import findOwned from './findOwned'
import findAll from './findAll'
import remove from './remove'
import update from './update'
import join from './join'
import sendDetailsEmail from './sendDetailsEmail/index'
import findById from './findById'
import isOwned from './isOwned'
import isJoined from './isJoined'
import findAttendingUsers from './findAttendingUsers'
import removeFromLesson from './removeFromLesson'

export default router({
  create,
  findOwned,
  findAll,
  remove,
  update,
  join,
  sendDetailsEmail,
  findById,
  isOwned,
  isJoined, // for button switch between join and remove me from lesson??
  findAttendingUsers,
  removeFromLesson
})
