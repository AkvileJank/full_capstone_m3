import { lessonSchema } from '@server/entities/lesson'
import type { LessonBare } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Lesson } from '@server/entities'
import { User } from '@server/entities/user'
import type { AuthUser } from '@server/entities/user'
import {
  notFound,
  lessonFull,
  userIsTeacher,
  alreadyAttending,
} from '../utils/tRPCErrors'
import joinEmail from '../../../utils/sendDetailsEmail/joinEmail'
import getTeacherName from '../utils/getTeacherName'

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
          select: ['id', 'firstName', 'lastName', 'email'],
        })

      const attendees = lesson!.attendingUsers || []

      // add new user to lesson
      attendees.push(fullAuthUser!)
      lesson!.capacity -= 1

      const lessonWithUser = await transactionalEntityManager
        .getRepository(Lesson)
        .save({ ...lesson!, attendingUsers: attendees })

      const isUserAttending = checkAttending(lessonWithUser, authUser.id)

      const teacherName = await getTeacherName(db, lesson!.teacherId)

      // send email
      await joinEmail(fullAuthUser!, { ...lesson!, teacher: teacherName })

      const { attendingUsers, ...lessonInfo } = lesson!

      return {
        ...lessonInfo,
        isUserAttending, // for tests
      }
    })
    return result
  })

function lessonErrorHandler(lesson: Lesson, authUser: AuthUser) {
  if (!lesson) notFound()
  if (lesson?.teacherId === authUser.id) userIsTeacher()
  if (lesson?.capacity === 0) lessonFull()

  const isAttending = checkAttending(lesson, authUser.id)
  if (isAttending) alreadyAttending()
}

function checkAttending(lesson: Lesson, authUserId: number) {
  return lesson.attendingUsers.some((user) => user.id === authUserId)
}
