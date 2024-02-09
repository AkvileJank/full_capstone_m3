import { User, Lesson } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import lessonRouter from '..'

const db = await createTestDatabase()

it('should return true if logged in user owns lesson', async () => {
  const userTeacher = await db.getRepository(User).save(fakeUser())

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: userTeacher.id }))

  const { isOwned } = lessonRouter.createCaller(
    authContext({ db }, userTeacher)
  )
  const result = await isOwned({ id: lesson.id })

  expect(result).toEqual(true)
})

it('should return false if logged in user does not own lesson', async () => {
  const [userTeacher, userLearner] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: userTeacher.id }))

  const { isOwned } = lessonRouter.createCaller(
    authContext({ db }, userLearner)
  )
  const result = await isOwned({ id: lesson.id })

  expect(result).toEqual(false)
})
