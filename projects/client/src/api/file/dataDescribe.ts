import { AUTH_TOKEN_KEY } from 'shared/constants'
import type { DataRoot } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $put } = useRequest()
let tokenStr: any = null
if (typeof window !== 'undefined') {
  // Perform localStorage action
  tokenStr = localStorage.getItem(AUTH_TOKEN_KEY) || null
}

/** filename 为DATABASE_ENG + .doc */
export function getDataDescribe(dataRootId: DataRoot, filename: string, token = tokenStr) {
  return `${import.meta.env.VITE_API_BASE}/file/private/db/${dataRootId}/${filename}?token=${token}`
}

export function downloadDataDescribe(dataRootId: DataRoot, filename: string, file: FormData) {
  const res = $put(`file/private/db/${dataRootId}/${filename}`, file)
  return res
}
