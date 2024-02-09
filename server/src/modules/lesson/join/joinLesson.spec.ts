import { User, Lesson } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import lessonRouter from '..'

const db = await createTestDatabase()

it('should add attending user to a lesson', async () => {
  const [userTeacher, userLearner] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])
  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: userTeacher.id }))

  const { join } = lessonRouter.createCaller(authContext({ db }, userLearner))

  const response = await join({ id: lesson.id })

  expect(response).toEqual({
    ...lesson,
    capacity: lesson.capacity - 1,
    attendingUsers: [
      {
        id: userLearner.id,
        firstName: userLearner.firstName,
        lastName: userLearner.lastName,
      },
    ],
    teacher: undefined,
  })
})

it('should allow multiple users to join to the lesson', async () => {
  const userTeacher = await db.getRepository(User).save(fakeUser())

  const userLearner = await db.getRepository(User).save(fakeUser())
  const fakeExistingLearner = await db.getRepository(User).save(fakeUser())

  const lesson = await db.getRepository(Lesson).save(
    fakeLesson({
      teacherId: userTeacher.id,
      attendingUsers: [fakeExistingLearner],
    })
  )

  const { join } = lessonRouter.createCaller(authContext({ db }, userLearner))
  const response = await join({ id: lesson.id })

  expect(response).toEqual({
    ...lesson,
    capacity: expect.any(Number),
    attendingUsers: [
      {
        id: fakeExistingLearner.id,
        firstName: fakeExistingLearner.firstName,
        lastName: fakeExistingLearner.lastName,
      },
      {
        id: userLearner.id,
        firstName: userLearner.firstName,
        lastName: userLearner.lastName,
      },
    ],
    teacher: undefined,
  })
})

it('should throw error if user is already attending', async () => {
  const userTeacher = await db.getRepository(User).save(fakeUser())
  const userLearner = await db.getRepository(User).save(fakeUser())

  const lesson = await db.getRepository(Lesson).save(
    fakeLesson({
      teacherId: userTeacher.id,
      attendingUsers: [userLearner],
    })
  )

  const { join } = lessonRouter.createCaller(authContext({ db }, userLearner))
  await expect(join({ id: lesson.id })).rejects.toThrow(/registered/)
})

it('should throw error if user created this lesson', async () => {
  const userTeacher = await db.getRepository(User).save(fakeUser())
  const lesson = await db.getRepository(Lesson).save(
    fakeLesson({
      teacherId: userTeacher.id,
    })
  )
  const { join } = lessonRouter.createCaller(authContext({ db }, userTeacher))
  await expect(join({ id: lesson.id })).rejects.toThrow(/created/)
})

it('should throw error if lesson has 0 capacity', async () => {
  const userTeacher = await db.getRepository(User).save(fakeUser())
  const userLearner = await db.getRepository(User).save(fakeUser())

  const lesson = await db
    .getRepository(Lesson)
    .save(fakeLesson({ teacherId: userTeacher.id, capacity: 0 }))

  const { join } = lessonRouter.createCaller(authContext({ db }, userLearner))

  await expect(join({ id: lesson.id })).rejects.toThrow(/full/)
})
