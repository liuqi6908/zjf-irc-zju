import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function putSuggest(dataDirectoryId: string, reason: string) {
  return $put(`data-suggest/${dataDirectoryId}`, { reason })
}
