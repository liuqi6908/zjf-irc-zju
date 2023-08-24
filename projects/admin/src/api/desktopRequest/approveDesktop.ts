import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function approveDesktop(userId: string) {
  return $post(`desktop-request/approve/${userId}`)
}
