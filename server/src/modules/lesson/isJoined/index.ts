import { Lesson, lessonSchema } from '@server/entities/lesson'
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

    const studentIds = lesson?.attendingUsers.map((user) => user.id)
    return studentIds!.includes(authUser.id) // return true if authUser joined this lesson
  })
