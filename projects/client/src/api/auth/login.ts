import type { ILoginSuccessResData } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function login(password: string, account?: string, email?: string) {
  return $post<ILoginSuccessResData>('auth/login/password', {
    password,
    account,
    email,
  })
}
