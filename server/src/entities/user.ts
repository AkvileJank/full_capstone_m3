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
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(64),
  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
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
