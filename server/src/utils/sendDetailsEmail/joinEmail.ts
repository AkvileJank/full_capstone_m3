import nodemailer from 'nodemailer'
import config from '@server/config'
import { User } from '@server/entities'
import type { LessonDetails } from '@server/entities/lesson'
import { joinEmail } from './texts'

export default async (
  student: Pick<User, 'firstName' | 'email'>,
  lesson: LessonDetails
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser, // gmail account for project
      pass: config.emailPass, // psw for that account
    },
  })

  const mailText = joinEmail(student.firstName, lesson)

  const mailOptions = {
    from: 'emailforbe3@gmail.com', // config.emailUser
    to: student.email,
    ...mailText,
  }

  if (config.env !== 'test') {
    await transporter.sendMail(mailOptions)
  }

  return {
    message: 'Email was sent successfully!',
  }
}
