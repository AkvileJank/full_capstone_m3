import { User } from '@server/entities'
import { Lesson } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const user = await db.getRepository(User).findOne({
      where: {
        id: authUser.id,
      },
      relations: ['attendingLessons'],
    })

    return formatLessons(user!.attendingLessons)
  }
)

function formatLessons(lessons: Lesson[]) {
  return lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title
  }))
}