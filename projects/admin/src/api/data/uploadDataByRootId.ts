import type { DataRoot } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function uploadDataByRootId(dataRootId: DataRoot.PRE_PURCHASED | DataRoot.PUBLIC | DataRoot.PURCHASED | DataRoot.SELF_BUILT, file: FormData) {
  return $put(`data/upload/${dataRootId}`, file)
}
