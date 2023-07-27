export const PHONE_NUMBER_REQUIREMENTS_DESC = `手机号码必须是11位数字`

export const PHONE_NUMBER_MIN_LENGTH = 11
export const PHONE_NUMBER_MAX_LENGTH = 11

/**
 * 检查一个手机号是否合法，如果合法，返回空字符串，否则返回错误信息
 * @param phone 
 * @returns 
 */
export function validatePhone(phone: string | number) {
  if (typeof phone === 'number') phone = phone.toString()
  if (typeof phone !== 'string') return `手机号码必须是字符串`
  if (phone.length < PHONE_NUMBER_MIN_LENGTH) return `手机号码长度不得小于 ${PHONE_NUMBER_MIN_LENGTH}`
  if (phone.length > PHONE_NUMBER_MAX_LENGTH) return `手机号码长度不得大于 ${PHONE_NUMBER_MAX_LENGTH}`
  // 以 1 开头，后面跟 10 位数字
  if (!/^1\d{10}$/.test(phone)) return `手机号格式有误`
  return ""
}