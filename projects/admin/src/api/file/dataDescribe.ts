import { getUrlByToken } from './getUrl'

const { $put } = useRequest()

/** filename 为DATABASE_ENG + .doc */
export function getDataDescribe(id: string, filename: string) {
  return getUrlByToken(`file/private/db/${id}/${filename}`)
}

export function uploadDataDescribe(id: string, filename: string, file: FormData) {
  const res = $put(`file/private/db/${id}/${filename}`, file)
  return res
}
