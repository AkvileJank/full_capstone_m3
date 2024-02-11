import type { User } from '../entities'

export default (users: User[]) => {
  const usersFormatted = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  }))
  return usersFormatted
}
