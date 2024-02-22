import { test, expect } from '@playwright/test'
import { loginNewUser } from './utils/api'
import { random, fakeUser } from './utils/fakeData'

const fakeLesson = () => ({
  title: random.sentence(),
  dateTime: random.date(),
  capacity: 20,
  duration: 20,
  description: random.sentence(),
  location: random.address(),
})

test.describe.serial('see a lesson', () => {
  const user = fakeUser()
  const lesson = fakeLesson()

  test('user can create a lesson', async ({ page }) => {
    await loginNewUser(page, user)
    await page.goto('/dashboard')

    const lessonsCreatedList = page.getByTestId('lessonsCreated').getByTestId('lessonList')
    expect(lessonsCreatedList).toBeHidden()

    // click on a button to create a new project
    await page.getByTestId('createLesson').click()

    // enter a project name
    const form = page.getByRole('form', { name: 'Lesson' })
    await form.getByRole('textbox', { name: 'Title' }).fill(lesson.title)
    await form.getByTestId('datepicker').click()
    await page.getByText('Select').click()
    await form.getByTestId('duration').fill(String(lesson.duration))
    await form.getByRole('textbox', { name: 'Location' }).fill(lesson.location)
    await form.getByTestId('capacity').fill('' + lesson.capacity)
    await form.getByTestId('description').fill(lesson.description)

    await form.locator('button[type="submit"]').click()
    // await page.waitForLoadState('load')
    await page.goto('/dashboard')
    await expect(page.getByTestId('title')).toContainText(lesson.title)
  })

  test('can see lesson details', async ({ page }) => {
    // Give (Arrange)
    await loginNewUser(page, user)
    await page.goto('/dashboard')
    await page.getByTestId('seeLessonDetails').click()

    await page.waitForLoadState('load')

    const lessonDetails = page.getByTestId('lessonDetails')
    await expect(lessonDetails).toContainText(lesson.title)
    await expect(lessonDetails).toContainText(lesson.location)
    await expect(lessonDetails).toContainText(lesson.description)
  })

  // // find lessons
  test.skip('go to find lessons page', async ({ page }) => {
    // Give (Arrange)
    await loginNewUser(page, user)
    await page.goto('/dashboard')
    await page.getByTestId('findLessons').click()

    const message = page.getByTestId('lessonListEmpty')
    await expect(message).toBeHidden()
  })

  // //user can edit the lesson
  test.skip('can edit lesson', async ({ page }) => {
    // Give (Arrange)
    await loginNewUser(page, user)
    await page.goto('/dashboard')
    // await page.getByTestId('viewProjectBugs').click()
    await page.getByTestId('seeLessonDetails').click()

    await page.waitForLoadState('load')

    await page.getByTestId('updateLesson').click()
    const form = page.getByRole('form', { name: 'Lesson' })
    const newTitle = 'Updated test title'
    await page.fill('input[name="title"]', newTitle)

    await form.locator('button[type="submit"]').click()

    await page.goto('/dashboard')
    await page.waitForLoadState('load')
    await page.getByTestId('seeLessonDetails').click()

    await expect(page.getByTestId('lessonDetails')).toContainText(newTitle)
  })

  test.skip('can remove lesson', async ({ page }) => {
    await loginNewUser(page, user)
    await page.goto('/dashboard')

    const lessonsCreatedList = page.getByTestId('lessonList')
    await page.getByTestId('seeLessonDetails').click()

    await page.waitForLoadState('load')
    await page.getByTestId('updateLesson').click()
    await page.waitForLoadState('load')

    await page.getByTestId('deleteLesson').click()

    // await page.waitForLoadState('load')

    await page.getByTestId('remove').click()
    await page.goto('/dashboard')
    // await page.waitForLoadState('load')

    await expect(lessonsCreatedList).toBeHidden()
  })
})
