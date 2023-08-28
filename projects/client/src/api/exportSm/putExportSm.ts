import { useRequest } from '../../composables/request'

const { $put } = useRequest()
export function putExportSm(file: File, note: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('note', note)
  return $put('export-sm', formData)
}
