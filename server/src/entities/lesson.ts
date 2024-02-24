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
import type { Student } from './user'

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  title: string

  @Column('timestamp with time zone')
  dateTime: Date

  @Column('integer')
  duration: number

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
  title: z
    .string()
    .trim()
    .min(2, { message: 'Must be longer than 2 characters' })
    .max(150, { message: `Can't be longer than than 150 characters` }),
  dateTime: z.date(),
  duration: z
    .number()
    .positive()
    .int()
    .min(1, { message: `Can't be less than 1 minute` }),
  location: z
    .string()
    .trim()
    .min(2, { message: 'Must be longer than 1 character' })
    .max(1000, {
      message: `Can't be longer than than 1000 characters`,
    }),
  capacity: z
    .number()
    .positive()
    .int()
    .min(1, { message: 'Must be more than 0' })
    .max(100000, { message: `Can't be more than 100000` }),
  description: z
    .string()
    .trim()
    .min(2, { message: 'Must be longer than 1 character' })
    .max(1000, {
      message: `Can't be longer than than 1000 characters`,
    }),
  teacherId: z.number().positive().int(),
})

export const lessonInsertSchema = lessonSchema.omit({ id: true })
export type LessonInsert = z.infer<typeof lessonInsertSchema>

export const lessonUpdateSchema = {
  ...lessonSchema.omit({ teacherId: true }).partial(),
  id: z.number().positive().int(),
}

export type LessonPreview = Pick<
  LessonBare,
  'id' | 'title' | 'dateTime' | 'location'
>
export type LessonDetails = {
  title: string
  dateTime: Date
  duration: number
  location: string
  capacity: number
  description: string
  teacher: string
  attendingUsers?: Student[]
}
