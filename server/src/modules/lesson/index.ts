import { router } from '@server/trpc'
import create from './create'
import findAll from './findAll'
import remove from './removeLesson'
import update from './update'
import join from './join'
import findById from './findById'
import removeFromLesson from './removeFromLesson'

export default router({
  create,
  findAll,
  remove,
  update,
  join,
  findById,
  removeFromLesson,
})
