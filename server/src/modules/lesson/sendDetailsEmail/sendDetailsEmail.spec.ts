import { User, Lesson } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

const db = await createTestDatabase()
// create users, user1 - will be attendee, user2 - will create a lesson

it('should send an email to user with lesson details', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  // create lesson by user2
  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user2.id }))

  const { sendDetailsEmail } = lessonsRouter.createCaller(
    authContext({ db }, user1)
  )

  const response = await sendDetailsEmail({ id: lesson.id })
  expect(response.message.toLowerCase()).toMatch(/email/)
})
