import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  Unique,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { z } from 'zod'
import { Lesson } from './lesson'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text', {
    select: false,
  })
  password: string

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  // lessons that the user owns (is a teacher)
  @OneToMany(() => Lesson, (lesson) => lesson.teacher, {
    cascade: true,
  })
  ownedLessons: Lesson[]

  // user can attend many lessons ???
  @ManyToMany(() => Lesson, (lesson) => lesson.attendingUsers, {
    cascade: true,
  })
  @JoinTable() // specify name
  attendingLessons: Lesson[]
}

export type UserBare = Omit<User, 'ownedLessons' | 'attendingLessons'>

export const userSchema = validates<UserBare>().with({
  id: z.number().positive().int(),
  email: z
    .string()
    .trim()
    .email({ message: 'Format is not valid' })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: 'Must have at least 8 characters' })
    .max(64, { message: `Can't be longer than 64 characters` }),
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character' }),
})

export const userInsertSchema = userSchema.omit({
  id: true,
})

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<User, 'id'>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
})

export type Student = Pick<UserBare, 'firstName' | 'lastName'>
