import { Lesson, User } from '@server/entities'
import { LessonBare } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { validates } from '@server/utils/validation'
import { Not } from 'typeorm'
import { z } from 'zod'

//find lessons created by other users
type InputPagination = {
  page: number
  pageSize: number
}

const inputPaginationSchema = validates<InputPagination>().with({
  page: z.number().positive().int(),
  pageSize: z.number().positive().int(),
})

export default authenticatedProcedure
  .input(inputPaginationSchema)
  .query(async ({ input: { page, pageSize }, ctx: { authUser, db } }) => {
    const skip = (page - 1) * pageSize

    const lessons = await db.getRepository(Lesson).find({
      where: {
        teacherId: Not(authUser.id),
        capacity: Not(0),
      },
      select: {
        id: true,
        title: true,
        dateTime: true,
        location: true
      },
      relations: ['attendingUsers'],
      order: {
        id: 'DESC',
      },
      skip,
      take: pageSize,
    })

    const totalCount = await db.getRepository(Lesson).count({
      where: {
        teacherId: Not(authUser.id),
        capacity: Not(0),
      },
    })
    const totalPages = Math.ceil(totalCount / pageSize)

    // Return only those lessons that authUser has not joined yet
    // const availableLessons = lessons.filter((lesson) => {
    //   const studentIds = lesson.attendingUsers.map((user) => user.id)
    //   return !studentIds.includes(authUser.id)
    // })

    return { lessons, totalPages, totalCount }
  })
