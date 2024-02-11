import { User } from '@server/entities'
import { DataSource } from 'typeorm'

export default async (db: DataSource, id: number) => {
  const teacher = await db.getRepository(User).findOneBy({
    id,
  })
  if (!teacher) throw new Error('Error with getting teacher')
  return `${teacher?.firstName} ${teacher?.lastName}`
}
