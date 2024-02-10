import { LessonView } from '@server/modules/lesson/sendDetailsEmail'

// should be a util function
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

const signupEmail = (userName: string) => ({
  subject: 'Welcome to the platform',
  text: `
    Welcome aboard, ${userName}!

    Thank you for becoming a part of our vibrant community.
    We hope you will discover lessons to join that are interesting to you or you can share your unique skills with others!

    Best of luck on the platform!
    `,
})

const joinEmail = (userName: string, lesson: LessonView) => ({
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

const removeEmail = (lessonTitle: string, userName: string) => ({
  subject: `Important update on the lesson: ${lessonTitle}`,
  text: `
    Hello, ${userName}!

    We want to inform you that lesson: ${lessonTitle}, which you have joined, was unfortunately removed from the platform by the teacher.

    We understand this might be disappointing, and we sincerely apologize for any inconvenience caused.
    Don't worry, though! There are other exciting lessons on the platform. Feel free to explore and find another one that piques your interest.

    Onwards and upwards!
      `,
})

export function pickEmailText(
  lesson: LessonView,
  userName: string,
  options: { isSignedUp?: boolean; isJoined?: boolean; isRemoved?: boolean }
) {
  if (options.isSignedUp) return signupEmail(userName)
  if (options.isJoined) return joinEmail(userName, lesson)
  if (options.isRemoved) return removeEmail(lesson.title, userName)
}
