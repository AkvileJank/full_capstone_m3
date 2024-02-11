import { Lesson, LessonBare, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { User } from '@server/entities'
import { notFound } from '../utils/tRPCErrors'
import getTeacherName from '../utils/getTeacherName'

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

    if (authUser.id !== lesson.teacherId) {
      const teacherName = await getTeacherName(db, lesson.teacherId)
      return {
        ...lesson,
        teacher: teacherName,
      }
    }
    return lesson
  })
