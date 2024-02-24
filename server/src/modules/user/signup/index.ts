import bcrypt from 'bcrypt'
import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import config from '@server/config'
import { userInsertSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import signupEmail from '@server/utils/sendDetailsEmail/signupEmail'
import logger from '@server/logger'

export default publicProcedure
  .input(userInsertSchema)
  .mutation(
    async ({
      input: { email, password, firstName, lastName },
      ctx: { db },
    }) => {
      const hash = await bcrypt.hash(password, config.auth.passwordCost)

      // ideally user should be added after sign up confirmation email could be sent (email should be valid)
      // for reviewer to sign up with any email address I kept the order as it is now
      try {
        const user = await db.getRepository(User).save({
          email,
          password: hash,
          firstName,
          lastName,
        })
        logger.info(
          `User with id: ${user.id} and email: ${user.email} was created`
        )
        // send Email
        if (config.env !== 'test')
          await signupEmail({ email: user.email, firstName: user.firstName })

        return {
          id: user.id,
          email: user.email,
        }
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error
        }

        if (error.message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
          })
        }

        if (error.message.includes('email')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Sign up confirmation email could not be sent',
          })
        }

        throw error
      }
    }
  )
