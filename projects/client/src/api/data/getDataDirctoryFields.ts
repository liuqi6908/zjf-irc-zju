import type { DataField } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDataFields(dataDirectoryId: string) {
  return $get<DataField[]>(`data/fields/${dataDirectoryId}`)
}
