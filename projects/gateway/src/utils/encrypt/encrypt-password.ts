import * as bcrypt from 'bcrypt'

/**
 * 加密密码
 * @param password
 * @returns
 */
export async function encryptPassword(password: string) {
  const saltOrRounds = 10
  return await bcrypt.hash(password, saltOrRounds)
}

/**
 * 校验密码是否正确
 * @param password
 * @param hash
 * @returns
 */
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}
