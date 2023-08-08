import { useRequest } from '../../../composables/request'

const { $patch } = useRequest()

/** 修改邮箱（登录就可以修改） */
export function changeEmail(email: string, bizId: string, code: string) {
  return $patch('user/own/email', { email, bizId, code })
}
