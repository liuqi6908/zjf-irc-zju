import { useRequest } from '../../composables/request'

const { $patch } = useRequest()
export function changeNickname(nickname: string) {
  return $patch('user/own/profile', { nickname })
}
