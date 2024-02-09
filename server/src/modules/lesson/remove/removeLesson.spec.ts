import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Lesson } from '@server/entities'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

const db = await createTestDatabase()

it('should remove a lesson', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lessons = await db
    .getRepository(Lesson)
    .save([
      fakeLesson({ teacherId: user1.id }),
      fakeLesson({ teacherId: user2.id }),
    ])
  const { remove } = lessonsRouter.createCaller(authContext({ db }, user1))

  const removedLesson = await remove({ id: lessons[0].id })
  expect(removedLesson).toEqual({
    ...lessons[0],
    id: undefined, // after remove id is returned as undefined
    teacher: undefined,
    attendingUsers: []
  })

  // remaining lessons should not contain deleted one
  const leftLessons = await db.getRepository(Lesson).find()
  expect(leftLessons).not.toContain({
    ...lessons[1],
    teacher: undefined,
    attendingUsers: undefined,
  })
})

it('should throw error if user is not a teacher for this lesson', async () => {
  const [userLearner, userTeacher] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: userTeacher.id }))

  const { remove } = lessonsRouter.createCaller(
    authContext({ db }, userLearner)
  )

  await expect(remove({ id: lesson.id })).rejects.toThrow(/not allowed/)
})
