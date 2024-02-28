import config from '@server/config'
import { User } from '@server/entities'
import type { LessonDetails } from '@server/entities/lesson'
import logger from '@server/logger'
import { joinEmail } from './texts'
import emailSetup from './emailSetup'

export default async (
  student: Pick<User, 'firstName' | 'email'>,
  lesson: LessonDetails
) => {
  const mailText = joinEmail(student.firstName, lesson)
  const { transporter, mailOptions } = emailSetup(
    config.emailUser,
    config.emailPass,
    student.email,
    mailText
  )

  if (config.env !== 'test') {
    try {
      await transporter.sendMail(mailOptions)
      logger.info(`Join confirmation email sent to user ${student.email}`)
    } catch (e) {
      logger.error(e)
    }
  }
}
