import { Lesson, lessonSchema } from '@server/entities/lesson'
import { User } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { notFound } from '../utils/tRPCErrors'
import getTeacherName from '../utils/getTeacherName'

export default authenticatedProcedure
  .input(
    lessonSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { authUser, db } }) => {
    const lesson = await db.getRepository(Lesson).findOneBy({
      id,
    })

    if (!lesson) notFound()

    const { attendingUsers, ...lessonInfo } = lesson!

    if (authUser.id !== lesson!.teacherId) {
      const teacherName = await getTeacherName(db, lesson!.teacherId)
      const isJoined = lesson?.attendingUsers.some(
        (user) => user.id === authUser.id
      )

      return {
        ...lessonInfo,
        teacher: teacherName,
        isOwned: false,
        isJoined,
      }
    }
    return {
      ...lessonInfo,
      attendingUsers: formatUsers(lesson!.attendingUsers),
      isOwned: true,
    }
  })

function formatUsers(users: User[]) {
  return users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
  }))
}
