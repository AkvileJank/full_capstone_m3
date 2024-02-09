import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

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

  const result = await removeFromLesson({ id: lesson.id })
  expect(result.attendingUsers).not.toContain(userLearner)
})
