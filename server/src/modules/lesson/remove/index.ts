import { Lesson, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { notAllowed, notFound } from '../tRPCErrors'

export default authenticatedProcedure
  .input(
    lessonSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: {id}, ctx: { db, authUser } }) => {
    const lesson = await db.getRepository(Lesson).findOneBy({
      id,
    })

    if (!lesson) notFound()
    if (lesson!.teacherId !== authUser.id) notAllowed()

    const removedLesson = await db.getRepository(Lesson).remove(lesson!)

    return removedLesson
  })
