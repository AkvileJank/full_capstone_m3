import { fakeLesson } from '@server/entities/tests/fakes'
import * as texts from './texts'

describe('signupEmail', () => {
  it('should return sign up email text', () => {
    const userName = 'John'
    const result = texts.signupEmail(userName)

    expect(result.subject).toContain('Welcome')
    expect(result.text).toContain(userName)
  })
})

describe('joinEmail', () => {
  it('should return join email text', () => {
    const userName = 'John'
    const lesson = { ...fakeLesson(), teacher: 'Luke Hobs' }
    const result = texts.joinEmail(userName, lesson)

    expect(result.subject).toContain(lesson.title)
    expect(result.text).toContain(userName)
    expect(result.text).toContain(lesson.title)
    expect(result.text).toContain(lesson.location)
    expect(result.text).toContain(lesson.teacher)
  })
})
