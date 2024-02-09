import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { validates } from '@server/utils/validation'
import { z } from 'zod'
import { User } from './user'

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  title: string

  @Column('text')
  dateTime: string

  @Column('text')
  location: string

  @Column('integer')
  capacity: number

  @Column('text')
  description: string

  @Column('integer')
  teacherId: number

  // user that hosts the lesson
  @ManyToOne(() => User, (user) => user.ownedLessons)
  teacher: User

  // lesson can have many attending users
  @ManyToMany(() => User, (user) => user.attendingLessons, { eager: true })
  attendingUsers: User[]
}

export type LessonBare = Omit<Lesson, 'teacher' | 'attendingUsers'>

export const lessonSchema = validates<LessonBare>().with({
  id: z.number().positive().int(),
  title: z.string().trim().min(2).max(150),
  dateTime: z.string(),
  location: z.string().trim().min(2).max(1000),
  capacity: z.number().positive().int().max(1000000),
  description: z.string().trim().min(2).max(1000),
  teacherId: z.number().positive().int(),
})

export const lessonInsertSchema = lessonSchema.omit({ id: true })
export type LessonInsert = z.infer<typeof lessonInsertSchema>

export const lessonUpdateSchema = {
  ...lessonSchema.omit({ teacherId: true }).partial(),
  id: z.number().positive().int(),
}

export type LessonPreview = Pick<LessonBare, 'id' | 'title'>