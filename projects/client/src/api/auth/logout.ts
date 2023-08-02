import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function logout() {
  return $post('/auth/register', {})
}
