import { fileToFormData } from 'zjf-utils'
import { getUrlByToken } from './getUriByToken'

const { $put } = useRequest()
export function getDesktopRequestFileUrl(userId: string, filename: string) {
  return getUrlByToken(`file/private/desktop-request/${userId}/${filename}`)
}

export function putDesktopRequest(filename: string, file: File) {
  const formData = fileToFormData(file)
  return $put(`file/private/desktop-request/${filename}`, formData)
}
