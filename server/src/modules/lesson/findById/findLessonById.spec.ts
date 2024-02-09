import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

const db = await createTestDatabase()

it('should find lesson by id', async () => {
  const user = await db.getRepository(User).save(fakeUser())

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user.id }))

  const { findById } = lessonsRouter.createCaller(authContext({ db }, user))

  const result = await findById({ id: lesson.id })
  expect(result).toEqual({
    ...lesson,
    teacher: undefined,
    attendingUsers: [],
  })
})
