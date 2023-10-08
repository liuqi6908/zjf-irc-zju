/**
 * 隐藏敏感信息
 * @param input
 */
export function hideSensitiveInfo(input?: string): string | undefined {
  let result = ''

  // 邮箱
  if (input?.includes('@')) {
    const atIndex = input.indexOf('@')
    if (atIndex) {
      const username = input.slice(0, atIndex)
      const domain = input.slice(atIndex + 1)
      let hiddenUsername
      if (atIndex > 4)
        hiddenUsername = username.slice(0, 3) + '*'.repeat(username.length - 3)
      else if (atIndex > 2 && atIndex <= 4)
        hiddenUsername = username.slice(0, 2) + '*'.repeat(username.length - 2)
      else
        hiddenUsername = `${username.slice(0, 1)}*`
      result = `${hiddenUsername}@${domain}`
    }
  }
  // 身份证号
  else if (input && input.length > 7) {
    result = `${input.slice(0, 3)}${'*'.repeat(input.length - 7)}${input.slice(input.length - 4)}`
  }

  return result || input
}