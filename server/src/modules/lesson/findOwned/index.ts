import { Lesson, LessonBare } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

// find lessons created by user (where user is the teacher)

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const lessons = (await db.getRepository(Lesson).find({
      where: {
        teacherId: authUser.id,
      },
      order: { id: 'ASC' },
    })) as LessonBare[]
    return lessons
  }
)
