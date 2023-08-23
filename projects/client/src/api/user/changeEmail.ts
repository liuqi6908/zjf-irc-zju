import { useRequest } from '../../composables/request'

const { $patch } = useRequest()
export function changeEmail(email: string, bizId: string, code: string) {
  return $patch<boolean>('user/own/email', { email, bizId, code })
}
