import { encryptPasswordInHttp } from 'zjf-utils'

const { $patch } = useRequest()

export function changePassword(password: string, email: string, bizId: string, code: string) {
  password = encryptPasswordInHttp(password)
  return $patch('user/own/password/code', { password, email, bizId, code })
}

export function changePasswordOld(oldPassword: string, newPassword: string) {
  oldPassword = encryptPasswordInHttp(oldPassword)
  newPassword = encryptPasswordInHttp(newPassword)
  return $patch('/user/own/password/old', { oldPassword, newPassword })
}
