import { lessonSchema } from '@server/entities/lesson'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Lesson, User } from '../../../entities'
import sendEmail from './sendEmail'

export default authenticatedProcedure
  .input(lessonSchema.pick({ id: true }))
  // input could be whole lesson? then could call findById in frontend and pass lesson to sendEmail from here
  .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
    const lesson = await db.getRepository(Lesson).findOneBy({
      id,
    })

    const authUserDetails = await db.getRepository(User).findOne({
      where: {
        id: authUser.id,
      },
      select: ['email'],
    })

    const teacher = await db.getRepository(User).findOne({
      where: {
        id: lesson?.teacherId,
      },
      select: ['firstName', 'lastName'],
    })

   // NOTE: any potential security issues?
    const teacherName = `${teacher?.firstName} ${teacher?.lastName}`

    const response = await sendEmail(authUserDetails!.email, lesson!, teacherName)
    return response
  })
