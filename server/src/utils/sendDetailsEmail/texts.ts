import type { LessonDetails } from '@server/entities/lesson'

const formatDate = (date: Date) => {
  const dateFormatted = date.toLocaleDateString('en-CA')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const time = `${hours}:${minutes}`

  return {
    date: dateFormatted,
    time,
  }
}

export const signupEmail = (userName: string) => ({
  subject: 'Welcome to the platform',
  text: `
    Welcome aboard, ${userName}!

    Thank you for becoming a part of our vibrant community.
    We hope you will discover lessons to join that are interesting to you or you can share your unique skills with others!

    Best of luck on the platform!
    `,
})

export const joinEmail = (userName: string, lesson: LessonDetails) => ({
  subject: `Details about the lesson: ${lesson.title}`,
  text: `
      Greetings, ${userName}!

      Just here to send the details on the lesson you have successfuly registered to. How great!

        Title: ${lesson.title}
        Date: ${formatDate(lesson.dateTime).date}
        Time: ${formatDate(lesson.dateTime).time}
        Location: ${lesson.location}
        Teacher: ${lesson.teacher}

      Good luck on your upcoming endeavours!
      `,
})
