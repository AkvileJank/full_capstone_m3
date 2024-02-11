import { createTestDatabase } from '@tests/utils/database'
import { Lesson, User } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import userRouter from '../index'

const db = await createTestDatabase()

const lessonRepository = db.getRepository(Lesson)

it('should return empty list if user has no created lessons', async () => {
  const user = fakeUser()
  const { findOwned } = userRouter.createCaller(authContext({ db }, user))
  const foundLessons = await findOwned()

  expect(foundLessons).toEqual([])
})

it('should return a list of lessons', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  await lessonRepository.save([
    fakeLesson({ teacherId: user1.id }),
    fakeLesson({ teacherId: user2.id }),
  ])

  const { findOwned } = userRouter.createCaller(authContext({ db }, user1))

  const response = await findOwned()

  response.forEach((lesson) =>
    expect(lesson).toContain({
      teacherId: user1.id,
    })
  )
})
