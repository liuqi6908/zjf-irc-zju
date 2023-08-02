import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function login(password: string, account: string, email: string) {
  return $post('auth/login/password', {
    password,
    account,
    email,
  })
}
