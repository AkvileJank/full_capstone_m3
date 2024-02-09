import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

const db = await createTestDatabase()

it('should return attending users', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user1.id, attendingUsers: [user2] }))

  const { findAttendingUsers } = lessonsRouter.createCaller(
    authContext({ db }, user1)
  )
  const result = await findAttendingUsers({ id: lesson.id })

  expect(result).toContainEqual({
    firstName: user2.firstName,
    lastName: user2.lastName,
  })
})
