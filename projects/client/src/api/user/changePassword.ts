import { encryptPasswordInHttp } from 'zjf-utils'
import { useRequest } from '../../composables/request'

const { $patch } = useRequest()
export function changePassword(password: string, email: string, bizId: string, code: string) {
  password = encryptPasswordInHttp(password)
  return $patch('user/own/password/code', { password, email, bizId, code })
}
