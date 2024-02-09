import { TRPCError } from '@trpc/server'

export const notFound = () => {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'This lesson is not found',
  })
}

export const lessonFull = () => {
  throw new TRPCError({
    code: 'FORBIDDEN',
    message: `This lesson is full and can't be joined`,
  })
}

export const alreadyAttending = () => {
  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'Current user is already registered to this lesson',
  })
}

export const userIsTeacher = () => {
  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'This lesson was created by current user',
  })
}

export const notAllowed = () => {
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'User is not allowed to modify this lesson',
  })
}

export const missingId = () => {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Lesson id must be provided',
  })
}
