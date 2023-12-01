import { isClient } from '@vueuse/core'
import { AUTH_TOKEN_KEY } from 'shared/constants'

const { $getUri } = useRequest()

let tokenStr: string
if (isClient)
  tokenStr = localStorage.getItem(AUTH_TOKEN_KEY) || ''

export function getUrlByToken(url: string, params?: any, token = tokenStr) {
  return $getUri(`${url}?token=${token}`, params)
}
