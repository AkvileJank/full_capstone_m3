import nodemailer from 'nodemailer'
import config from '@server/config'
import { LessonBare } from '@server/entities/lesson'

export default async (
  recipientEmail: string,
  lesson: LessonBare,
  teacherName: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  })

  const mailOptions = {
    from: 'emailforbe3@gmail.com',
    to: recipientEmail,
    subject: `Information about your joined lesson: "${lesson.title}"`,
    text: `Here are the details for the lesson:\n
    Title: ${lesson.title}\n
    Date: ${lesson.dateTime}\n
    Location: ${lesson.location}\n
    Description: ${lesson.location}\n
    Teacher: ${teacherName}
    `,
  }

  if (config.env !== 'test') {
    await transporter.sendMail(mailOptions)
  }

  return {
    message: 'Email was sent successfully!',
  }
}
