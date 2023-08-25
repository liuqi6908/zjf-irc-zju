import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function rejectDesktop(userId: string, reason: string) {
  return $post(`desktop-request/reject/${userId}`, { reason })
}
