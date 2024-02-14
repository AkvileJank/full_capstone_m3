import { lessonUpdateSchema, Lesson } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { notAllowed, notFound, missingId } from '../utils/tRPCErrors'

export default authenticatedProcedure
  .input(lessonUpdateSchema)
  .mutation(async ({ input, ctx: { db, authUser } }) => {
    if (!input.id) missingId()
    const lesson = await db.getRepository(Lesson).findOneBy({ id: input.id })

    if (!lesson) notFound()
    if (lesson!.teacherId !== authUser.id) notAllowed()

    await db.getRepository(Lesson).update({ id: input.id }, { ...input })

    const updatedLesson = await db
      .getRepository(Lesson)
      .findOneBy({ id: input.id })

    const { attendingUsers, ...lessonInfo } = updatedLesson!
    return lessonInfo
  })
