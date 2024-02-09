import { User, Lesson } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import lessonRouter from '..'

const db = await createTestDatabase()

it('should return true if user is joined to lesson', async () => {
  const [userTeacher, userLearner] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(
      fakeLesson({ teacherId: userTeacher.id, attendingUsers: [userLearner] })
    )

  const { isJoined } = lessonRouter.createCaller(
    authContext({ db }, userLearner)
  )
  const result = await isJoined({ id: lesson.id })

  expect(result).toEqual(true)
})

it('should return false if user is not joined to lesson', async () => {
  const [userTeacher, userLearner] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: userTeacher.id }))

  const { isJoined } = lessonRouter.createCaller(
    authContext({ db }, userLearner)
  )
  const result = await isJoined({ id: lesson.id })

  expect(result).toEqual(false)
})
