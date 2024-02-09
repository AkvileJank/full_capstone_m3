import { Lesson, User } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import lessonRouter from '..'

const db = await createTestDatabase()

it('should update existing lesson', async () => {
  const user = await db.getRepository(User).save(fakeUser())
  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user.id }))
  const lessonNewData = {
    title: 'Updated title',
    capacity: 15,
  }

  const { update } = lessonRouter.createCaller(authContext({ db }, user))

  const updatedLesson = await update({
    id: lesson.id,
    ...lessonNewData,
  })

  expect(updatedLesson).toEqual({
    ...lesson,
    ...lessonNewData,
    teacher: undefined,
    attendingUsers: [],
  })
})

it('should return lesson unchanged if only id was provided', async () => {
  const user = await db.getRepository(User).save(fakeUser())
  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user.id }))

  const { update } = lessonRouter.createCaller(authContext({ db }, user))

  const updatedLesson = await update({
    id: lesson.id,
  })
  expect(updatedLesson).toEqual({
    ...lesson,
    teacher: undefined,
    attendingUsers: [],
  })
})

it('should throw error if user is not teacher for this lesson', async () => {
  const [user1, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])
  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: user1.id }))

  const { update } = lessonRouter.createCaller(authContext({ db }, user2))

  await expect(
    update({
      id: lesson.id,
      title: 'Should fail',
    })
  ).rejects.toThrow(/not allowed/)
})
