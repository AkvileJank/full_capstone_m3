export default (date: Date) => {
  const dateInType = new Date(date)
  const dateFormatted = dateInType.toLocaleDateString('en-CA')
  const hours = String(dateInType.getHours()).padStart(2, '0')
  const minutes = String(dateInType.getMinutes()).padStart(2, '0')
  const time = `${hours}:${minutes}`

  return { date: dateFormatted, time }
}
