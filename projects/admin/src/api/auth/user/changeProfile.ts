import { useRequest } from '../../../composables/request'

const { $patch } = useRequest()
/** 修改nickname */
export function changeProfile(nickname: string) {
  return $patch('user/own/profile', { nickname })
}
