import type { DataRoot, IDataDirectory } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $get } = useRequest()
export function getDataByRootId(dataRootId: DataRoot) {
  return $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
}
