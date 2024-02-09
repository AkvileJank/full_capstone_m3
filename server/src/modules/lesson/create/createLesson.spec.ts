import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeLesson, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import lessonsRouter from '..'

const db = await createTestDatabase()

it('should create a new lesson', async () => {
  const user = await db.getRepository(User).save(fakeUser())
  const lesson = fakeLesson()
  const { create } = lessonsRouter.createCaller(authContext({ db }, user))

  const response = await create(lesson)

  expect(response).toEqual({
    ...lesson,
    id: expect.any(Number),
    teacherId: user.id,
  })
})

it('should throw error if lesson title is missing', async () => {
  const user = await db.getRepository(User).save(fakeUser())
  const { create } = lessonsRouter.createCaller(authContext({ db }, user))

  const response = create({
    ...fakeLesson(),
    title: '',
  })
  await expect(response).rejects.toThrow(/title/)
})

/*
all other missing properties should throw zod errors
in the same manner due to defined input schema
*/
