import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function uploadDataByRootId(dataRootId: string, file: FormData, clear = true) {
  return $put(`data/upload/${dataRootId}`, file, { clear })
}
