import { AUTH_TOKEN_KEY } from 'shared/constants'

const { $post, $getUri } = useRequest()

let tokenStr: any = null
if (typeof window !== 'undefined') {
  // Perform localStorage action
  tokenStr = localStorage.getItem(AUTH_TOKEN_KEY) || null
}

export function tableFileIsExist(rootId: string, dataDirectorId: string) {
  return $post<boolean>('/file/isExist', {
    bucket: 'data',
    path: `/download/${rootId}/${dataDirectorId}.zip`,
  })
}

export function getDataDownload(dataDirectorId: string, token = tokenStr) {
  return $getUri(`data/download/link/${dataDirectorId}?token=${token}`)
}
