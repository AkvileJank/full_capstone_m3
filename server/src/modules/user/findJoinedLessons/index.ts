import { User } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import formatLessons from '@server/modules/lesson/utils/formatLessons'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const user = await db.getRepository(User).findOne({
      where: {
        id: authUser.id,
      },
      relations: ['attendingLessons'],
    })

    return formatLessons(user!.attendingLessons)
  }
)
