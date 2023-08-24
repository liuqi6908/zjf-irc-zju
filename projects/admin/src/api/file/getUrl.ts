import { AUTH_TOKEN_KEY } from 'shared/constants'

const { $getUri } = useRequest()

let tokenStr: any = null
if (typeof window !== 'undefined') {
  // Perform localStorage action
  tokenStr = localStorage.getItem(AUTH_TOKEN_KEY) || null
}

export function getUrlByToken(url: string, params?: any, token = tokenStr) {
  return $getUri(`${url}?token=${token}`, params)
  // return `${import.meta.env.VITE_API_BASE}/data/download/link/${dataDirectorId}?token=${token}`
}
