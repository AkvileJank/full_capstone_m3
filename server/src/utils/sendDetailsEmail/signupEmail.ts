import config from '@server/config'
import { User } from '@server/entities'
import logger from '@server/logger'
import { signupEmail } from './texts'
import emailSetup from './emailSetup'

export default async (user: Pick<User, 'firstName' | 'email'>) => {
  const mailText = signupEmail(user.firstName)
  const { transporter, mailOptions } = emailSetup(
    config.emailUser,
    config.emailPass,
    user.email,
    mailText
  )

  if (config.env !== 'test') {
    try {
      await transporter.sendMail(mailOptions)
      logger.info(`Sign up email was sent to user ${user.email}`)
    } catch (e) {
      logger.error(e)
    }
  }
}
