import dateFormatter from './dateFormatter'

describe('dateFormatter', () => {
  it('should return date string in correct format', () => {
    const date = new Date('2024-02-10 9:55')
    const formattedDate = dateFormatter(date)
    expect(formattedDate).toEqual({
      date: '2024-02-10',
      time: '09:55',
    })
  })
})
