export const EMAIL_MIN_LENGTH = 6
export const EMAIL_MAX_LENGTH = 64
export const EMAIL_REQUIREMENTS_DESC = `邮箱长度不得小于 ${EMAIL_MIN_LENGTH} 位，不得大于 ${EMAIL_MAX_LENGTH} 位`

/**
 * 校验一个邮箱是否合法，如果合法，返回空字符串，否则返回错误信息
 * @param mail 
 * @returns 
 */
export function validateEmail(mail: string) {
  if (typeof mail !== 'string') return `邮箱必须是字符串`
  if (mail.length < EMAIL_MIN_LENGTH) return `邮箱长度不得小于 ${EMAIL_MIN_LENGTH}`
  if (mail.length > EMAIL_MAX_LENGTH) return `邮箱长度不得大于 ${EMAIL_MAX_LENGTH}`
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(mail)) return `邮箱格式有误`
  return ""
}