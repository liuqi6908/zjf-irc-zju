import { fileToFormData } from 'zjf-utils'

const { $put } = useRequest()

export function putDesktopRequest(filename: string, file: File) {
  const formData = fileToFormData(file)
  return $put(`file/private/desktop-request/${filename}`, formData)
}
