import nodemailer from 'nodemailer'
import config from '@server/config'
import { User } from '@server/entities'
import type { LessonDetails } from '@server/entities/lesson'
import logger from '@server/logger'
import { joinEmail } from './texts'

export default async (
  student: Pick<User, 'firstName' | 'email'>,
  lesson: LessonDetails
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  })

  const mailText = joinEmail(student.firstName, lesson)

  const mailOptions = {
    from: 'emailforbe3@gmail.com',
    to: student.email,
    ...mailText,
  }

  if (config.env !== 'test') {
    try {
      await transporter.sendMail(mailOptions)
      logger.info(`Join confirmation email sent to user ${student.email}`)
    } catch (e) {
      logger.error(e)
    }
  }
}
