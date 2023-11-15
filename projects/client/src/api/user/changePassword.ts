import { encryptPasswordInHttp } from 'zjf-utils'

const { $patch } = useRequest()

export function changePassword(email: string, password: string, bizId: string, code: string) {
  return $patch('/user/own/password/code', { email, bizId, code, password })
}

export function changePasswordOld(oldPassword: string, newPassword: string) {
  oldPassword = encryptPasswordInHttp(oldPassword)
  newPassword = encryptPasswordInHttp(newPassword)
  return $patch('/user/own/password/old', { oldPassword, newPassword })
}
