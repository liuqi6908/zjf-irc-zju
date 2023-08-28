import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function putExportLg(file: File, note: string) {
  const fromData = new FormData()
  fromData.append('file', file)
  fromData.append('note', note)
  return $put('export-lg', fromData)
}
