import { Lesson, LessonBare, lessonInsertSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(lessonInsertSchema.omit({ teacherId: true }))
  .mutation(async ({ input: lessonData, ctx: { authUser, db } }) => {
    console.log(lessonData)
    const lesson = { ...lessonData, teacherId: authUser.id }
    const createdLesson = (await db
      .getRepository(Lesson)
      .save(lesson)) as LessonBare
    return createdLesson
  })
