import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'
import userRouter from '../../user'

const db = await createTestDatabase()

it('should remove user from joined lesson', async () => {
  const [userTeacher, userLearner] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(
      fakeLesson({ teacherId: userTeacher.id, attendingUsers: [userLearner] })
    )

  const { removeFromLesson } = lessonsRouter.createCaller(
    authContext({ db }, userLearner)
  )

  const lessonRemoval = await removeFromLesson({ id: lesson.id })

  // to get lessons that are joined by the user - should not contain lesson that user was removed from
  const { findJoinedLessons } = userRouter.createCaller(
    authContext({ db }, userLearner)
  )

  const result = await findJoinedLessons()

  expect(result).not.toContain(lessonRemoval)
})
