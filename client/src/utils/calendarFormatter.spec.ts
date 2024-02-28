import calendarFormatter from './calendarFormatter'

describe('calendarFormatter', () => {
  it('should return format for the calendar', () => {
    const date = new Date('2024-02-10 9:55')
    const formattedDate = calendarFormatter(date)
    expect(formattedDate).toEqual('2024-02-10 09:55')
  })
})
