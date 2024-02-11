import { Lesson, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { notFound } from '../utils/tRPCErrors'

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
    if (!lesson) notFound()

    return lesson!.attendingUsers.some((user) => user.id === authUser.id)
  })
