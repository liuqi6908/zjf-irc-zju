import { AUTH_TOKEN_KEY } from 'shared/constants'

const { $getUri } = useRequest()

let tokenStr: any = null
if (typeof window !== 'undefined') {
  // Perform localStorage action
  tokenStr = localStorage.getItem(AUTH_TOKEN_KEY) || null
}

export function getDataDownload(dataDirectorId: string, token = tokenStr) {
  return $getUri(`data/download/link/${dataDirectorId}?token=${token}`)
}
