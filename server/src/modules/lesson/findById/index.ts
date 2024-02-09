import { Lesson, LessonBare, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { User } from '@server/entities'

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

    if (authUser.id !== lesson.teacherId) {
      const teacher = await db.getRepository(User).findOneBy({
        id,
      })

      const teacherName = `${teacher?.firstName} ${teacher?.lastName}`
      return {
        title: lesson.title,
        location: lesson.location,
        capacity: lesson.capacity,
        teacher: teacherName,
        description: lesson.description,
      }
    }
    return lesson
  })
