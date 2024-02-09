import { Lesson, LessonBare, lessonSchema } from '@server/entities/lesson'
import { User } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(
    lessonSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { authUser, db } }) => {
    const lesson = await db.getRepository(Lesson).findOne({
      where: {
        id,
      },
      relations: ['attendingUsers'],
    })

    //   if(lesson?.teacherId !== authUser.id)
    // insert error

    return formatUsers(lesson!.attendingUsers)
  })

function formatUsers(users: User[]) {
  return users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName
  }))
}
