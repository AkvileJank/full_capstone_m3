import { Lesson, LessonBare, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { notFound } from '../utils/tRPCErrors'

export default authenticatedProcedure
  .input(
    lessonSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { authUser, db } }) => {
    const lesson = (await db.getRepository(Lesson).findOneBy({
      id,
    })) as LessonBare
    if (!lesson) notFound()
    return lesson.teacherId === authUser.id
  })
