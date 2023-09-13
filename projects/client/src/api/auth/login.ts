import type { ILoginSuccessResData } from 'zjf-types'

const { $post } = useRequest()

export function login(options: { password: string; account?: string; email?: string }) {
  return $post<ILoginSuccessResData>('auth/login/password', options)
}
