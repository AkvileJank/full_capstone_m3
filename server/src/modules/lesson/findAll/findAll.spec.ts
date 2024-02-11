import { Lesson, User } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeLesson, fakeUser } from '../../../entities/tests/fakes'
import lessonRouter from '..'

const db = await createTestDatabase()

it('should return a list of lessons from other users', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  await db
    .getRepository(Lesson)
    .save([
      fakeLesson({ teacherId: user1.id }),
      fakeLesson({ teacherId: user2.id }),
    ])

  const page = 1
  const pageSize = 5
  const { findAll } = lessonRouter.createCaller(authContext({ db }, user1))

  const result = await findAll({ page, pageSize })

  result.lessons.forEach((lesson) =>
    expect(lesson).not.toContain({
      teacherId: user1.id,
    })
  )
})
