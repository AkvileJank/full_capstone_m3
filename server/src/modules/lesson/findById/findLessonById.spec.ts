import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

const db = await createTestDatabase()

it('should find lesson by id when user is owner', async () => {
  const user = await db.getRepository(User).save(fakeUser())

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user.id }))

  const { findById } = lessonsRouter.createCaller(authContext({ db }, user))

  const result = await findById({ id: lesson.id })
  expect(result).toEqual({
    ...lesson,
    attendingUsers: [],
    teacher: undefined,
    isOwned: true,
  })
})

it('should find lesson by id when user is not owner and not joined', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user1.id }))

  const { attendingUsers, ...lessonInfo } = lesson

  const { findById } = lessonsRouter.createCaller(authContext({ db }, user2))

  const result = await findById({ id: lesson.id })
  expect(result).toEqual({
    ...lessonInfo,
    teacher: expect.any(String),
    isOwned: false,
    isJoined: false,
  })
})

it('should find lesson by id when user is not owner and is joined', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user1.id, attendingUsers: [user2] }))

  const { attendingUsers, ...lessonInfo } = lesson

  const { findById } = lessonsRouter.createCaller(authContext({ db }, user2))

  const result = await findById({ id: lesson.id })
  expect(result).toEqual({
    ...lessonInfo,
    teacher: expect.any(String),
    isOwned: false,
    isJoined: true,
  })
})
