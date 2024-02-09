import { Lesson, LessonBare, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.input(
    lessonSchema.pick({
      id: true,
    })
  ).query(
    async ({input: {id}, ctx: { authUser, db } }) => {
      const lesson = (await db.getRepository(Lesson).findOneBy({
       id
      })) as LessonBare
      return lesson.teacherId === authUser.id
    }
  )