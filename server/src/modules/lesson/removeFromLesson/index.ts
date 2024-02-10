import { Lesson, lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { notAllowed, notFound } from '../tRPCErrors'

export default authenticatedProcedure
  .input(
    lessonSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
    const result = await db.transaction(async (transactionalEntityManager) => {
      const lesson = await transactionalEntityManager
        .getRepository(Lesson)
        .findOneBy({
          id,
        })

      if (!lesson) notFound()
      // if (lesson!.teacherId !== authUser.id) notAllowed()

      const studentsIds = lesson!.attendingUsers.map((user) => user.id)
      // if(!studentsIds?.includes(authUser.id)) throw error

      lesson!.attendingUsers = lesson!.attendingUsers.filter(
        (user) => user.id !== authUser.id
      )
      lesson!.capacity += 1
      const updatedLesson = await transactionalEntityManager
        .getRepository(Lesson)
        .save(lesson!)

      return updatedLesson
    })
    return result
  })