import type { User } from '@server/entities/user'
import { random } from '@tests/utils/random'
import { Lesson } from '..'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
})

/**
 * Generates a fake lesson with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeLesson = <T extends Partial<Lesson>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  title: 'Test lesson',
  dateTime: '2024-01-09 18:00',
  location: 'Test location street',
  capacity: 10,
  description: 'This is a lesson for testing',
  ...overrides,
})
