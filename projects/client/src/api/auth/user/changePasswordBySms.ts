import { useRequest } from '../../../composables/request'

const { $patch } = useRequest()

export function changePasswordBySms(email: string, password: string, bizId: string, code: string) {
  return $patch('user/own/password/code', { email, bizId, code, password })
}
