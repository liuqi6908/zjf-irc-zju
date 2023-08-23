/**
 * 格式化日期
 * @param input
 * @returns
 */
export function formatDate(input?: Date | string | number | null): string {
  let date: Date

  if (input instanceof Date)
    date = input
  else if (typeof input === 'string' || typeof input === 'number')
    date = new Date(input)
  else
    date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
