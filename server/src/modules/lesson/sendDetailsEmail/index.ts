import { lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Lesson, User } from '../../../entities'
import sendEmail from './sendEmail'
import { validates } from '@server/utils/validation'
import { z } from 'zod'

export type LessonView = {
  title: string
  location: string
  capacity: number
  duration: number
  description: string
  dateTime: Date
  teacher: string
}

const lessonViewSchema = validates<LessonView>().with({
  title: z.string().trim().min(2).max(150),
  dateTime: z.date(),
  duration: z.number().positive().int().min(1),
  location: z.string().trim().min(2).max(1000),
  capacity: z.number().positive().int().max(1000000),
  description: z.string().trim().min(2).max(1000),
  teacher: z.string().min(2),
})

export default authenticatedProcedure
  .input(lessonViewSchema)
  // input could be whole lesson? then could call findById in frontend and pass lesson to sendEmail from here
  .mutation(async ({ input: lesson, ctx: { db, authUser } }) => {
    // const lesson = await db.getRepository(Lesson).findOneBy({
    //   id,
    // })

    const authUserDetails = await db.getRepository(User).findOne({
      where: {
        id: authUser.id,
      },
      select: ['firstName', 'email'],
    })

    // const teacher = await db.getRepository(User).findOne({
    //   where: {
    //     id: lesson?.teacherId,
    //   },
    //   select: ['firstName', 'lastName'],
    // })

    // NOTE: any potential security issues?
    // const teacherName = `${teacher?.firstName} ${teacher?.lastName}`

    const isJoined = true
    const response = await sendEmail(
      authUserDetails!,
      lesson,
      undefined,
      true
    )
    return response

    // need to send email based on the condition

    // 1. isSignedUp
    // 2. isJoined
    // 3. isRemoved
  })
