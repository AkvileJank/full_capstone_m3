import type { User } from '../entities'

export default (users: User[]) => {
  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  }))
}
