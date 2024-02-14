import { Lesson } from '@server/entities/lesson'

export default (lessons: Lesson[]) =>
  lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    dateTime: lesson.dateTime,
    location: lesson.location,
  }))
