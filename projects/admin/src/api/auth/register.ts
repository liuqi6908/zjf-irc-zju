import type { ILoginSuccessResData } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function register(
  account: string,
  email: string,
  password: string,
  bizId: string,
  code: string,
) {
  return $put<ILoginSuccessResData>('/auth/register', {
    password,
    account,
    email,
    bizId,
    code,
  })
}
