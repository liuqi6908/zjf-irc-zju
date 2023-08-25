import type { DataRoot } from 'zjf-types'
import { useRequest } from '../../composables/request'
import { getUrlByToken } from './getUrl'

const { $put } = useRequest()

/** filename 为DATABASE_ENG + .doc */
export function getDataDescribe(dataRootId: DataRoot, filename: string) {
  return getUrlByToken(`file/private/db/${dataRootId}/${filename}`)
}

export function uploadDataDescribe(dataRootId: DataRoot, filename: string, file: FormData) {
  const res = $put(`file/private/db/${dataRootId}/${filename}`, file)
  return res
}
