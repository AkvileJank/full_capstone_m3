import { Lesson, lessonInsertSchema } from '@server/entities/lesson'
import type { LessonBare } from '@server/entities/lesson'
import logger from '@server/logger'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
// import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(lessonInsertSchema.omit({ teacherId: true }))
  .mutation(async ({ input: lessonData, ctx: { authUser, db } }) => {
    const lesson = { ...lessonData, teacherId: authUser.id }
    try {
      const createdLesson = (await db
        .getRepository(Lesson)
        .save(lesson)) as LessonBare
      logger.info(
        `Lesson id:${createdLesson.id} was created by user id:${authUser.id}`
      )
      return createdLesson
    } catch (e) {
      logger.error(e)
      throw e
    }
  })
