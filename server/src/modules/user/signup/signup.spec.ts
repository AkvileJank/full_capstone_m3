import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import usersRouter from '..'

const db = await createTestDatabase()

const userRepository = db.getRepository(User)
const { signup } = usersRouter.createCaller({ db })

it('should create new user', async () => {
  const user = fakeUser()

  const response = await signup(user)

  const userCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password'>

  expect(userCreated).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: expect.not.stringContaining(user.password),
  })

  expect(userCreated.password).toHaveLength(60)
  expect(response).toEqual({
    id: expect.any(Number),
    email: user.email,
  })
  expect(response.id).toEqual(userCreated!.id)
})

it('should require a valid email', async () => {
  const user = fakeUser()
  await expect(
    signup({
      ...user,
      email: 'email123',
    })
  ).rejects.toThrow(/email/i)
})

it('should require a password with at least 8 characters', async () => {
  const user = fakeUser()
  await expect(
    signup({
      ...user,
      password: 'pas.123',
    })
  ).rejects.toThrow(/password/i)
})

it('stores lowercased email', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: user.email.toUpperCase(),
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})

it('stores email with trimmed whitespace', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: ` \t ${user.email}\t `,
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})
