import { lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Lesson } from '@server/entities'
import { AuthUser, User } from '@server/entities/user'
import {
  notFound,
  lessonFull,
  userIsTeacher,
  alreadyAttending,
} from '../tRPCErrors'

export default authenticatedProcedure
  .input(lessonSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
    const result = await db.transaction(async (transactionalEntityManager) => {
      const lesson = await transactionalEntityManager
        .getRepository(Lesson)
        .findOne({
          where: {
            id,
          },
          relations: ['attendingUsers'],
        })
      lessonErrorHandler(lesson!, authUser)
      // get user data from authUser id
      const fullAuthUser = await transactionalEntityManager
        .getRepository(User)
        .findOne({
          where: { id: authUser.id },
          select: ['id', 'firstName', 'lastName'],
        })

      const attendees = lesson!.attendingUsers || []

      // add new user to lesson
      attendees.push(fullAuthUser!)
      lesson!.capacity -= 1

      const lessonWithUser = await transactionalEntityManager
        .getRepository(Lesson)
        .save({ ...lesson!, attendingUsers: attendees })

      return {
        ...lessonWithUser,
        attendingUsers: formatUsers(attendees),
      }
    })
    return result
  })

function formatUsers(users: User[]) {
  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  }))
}

function lessonErrorHandler(lesson: Lesson, authUser: AuthUser) {
  if (!lesson) notFound()
  if (lesson?.teacherId === authUser.id) userIsTeacher()
  if (lesson?.capacity === 0) lessonFull()

  const isAttending = lesson!.attendingUsers.find(
    (user) => user.id === authUser.id
  )
  if (isAttending) alreadyAttending()
}
