import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import userRouter from '..'

const db = await createTestDatabase()

it('should return empty list if user has not joined any lessons', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  await db.getRepository(Lesson).save(fakeLesson({ teacherId: user1.id }))

  const { findJoinedLessons } = userRouter.createCaller(
    authContext({ db }, user2)
  )

  const result = await findJoinedLessons()
  expect(result).toEqual([])
})

it('should return a list of joined lessons if user has joined them', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user1.id, attendingUsers: [user2] }))

  const { findJoinedLessons } = userRouter.createCaller(
    authContext({ db }, user2)
  )

  const result = await findJoinedLessons()
  expect(result).toEqual([
    {
      id: lesson.id,
      title: lesson.title,
      dateTime: lesson.dateTime,
      location: lesson.location,
    },
  ])
})
