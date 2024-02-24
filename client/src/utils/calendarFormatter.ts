export default (date: Date) => {
  const dateString = date.toLocaleDateString('en-CA')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const timeString = `${hours}:${minutes}`
  return `${dateString} ${timeString}`
}
