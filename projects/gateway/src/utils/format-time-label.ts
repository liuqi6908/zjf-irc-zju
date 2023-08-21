export function formatTimeLabel(
  maybeTime: Date | string | number,
  format: 'year' | 'quarter' | 'month' | 'day' | 'hour' | 'minute',
) {
  const date = new Date(maybeTime)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const quarter = Math.floor((month - 1) / 3) + 1

  if (format === 'year')
    return `${year}`
  if (format === 'quarter')
    return `${year}Q${quarter}`
  if (format === 'month')
    return `${year}-${month}`
  if (format === 'day')
    return `${year}-${month}-${day}`
  if (format === 'hour')
    return `${year}-${month}-${day} ${hour}`
  return `${year}-${month}-${day} ${hour}:${minute}`
}
