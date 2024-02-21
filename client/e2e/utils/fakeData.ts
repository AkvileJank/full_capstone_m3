import { Chance } from 'chance'

// To use the same data seed
// every time to make the tests deterministic.
export const random = process.env.CI ? Chance(1) : Chance()

/**
 * Creates a new user with a random email and password
 */
export const fakeUser = () => ({
  email: random.email(),
  password: 'password.123',
  firstName: random.name().split(' ')[0],
  lastName: random.name().split(' ')[1],
})
