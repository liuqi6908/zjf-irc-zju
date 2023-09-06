import type { IDataField } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDataFields(dataDirectoryId: string) {
  return $get<IDataField[]>(`data/fields/${dataDirectoryId}`)
}
