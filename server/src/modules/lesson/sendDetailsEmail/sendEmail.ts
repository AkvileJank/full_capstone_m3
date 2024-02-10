import nodemailer from 'nodemailer'
import config from '@server/config'
import { User } from '@server/entities'
import { pickEmailText } from './texts'
import type { LessonView } from '.'

export default async (
  student: Pick<User, 'firstName'| 'email'>,
  lesson: LessonView,
  isSignedUp?: boolean,
  isJoined?: boolean,
  isRemoved?: boolean

  // teacherName: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser, // gmail account for project
      pass: config.emailPass, // psw for that account
    },
  })

  const mailText = pickEmailText(lesson, student.firstName, {isSignedUp, isJoined, isRemoved})

  const mailOptions = {
    from: 'emailforbe3@gmail.com', // config.emailUser
    to: student.email,
    ...mailText
  }

  if (config.env !== 'test') {
    await transporter.sendMail(mailOptions)
  }

  return {
    message: 'Email was sent successfully!',
  }
}
