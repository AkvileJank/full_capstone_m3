import nodemailer from 'nodemailer'
import config from '@server/config'
import { User } from '@server/entities'
import { signupEmail } from './texts'

export default async (user: Pick<User, 'firstName' | 'email'>) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser, // gmail account for project
      pass: config.emailPass, // psw for that account
    },
  })

  const mailText = signupEmail(user.firstName)
  const mailOptions = {
    from: config.emailUser, // config.emailUser
    to: user.email,
    ...mailText,
  }

  if (config.env !== 'test') {
    await transporter.sendMail(mailOptions)
  }

  return {
    message: 'Email was sent successfully!',
  }
}
