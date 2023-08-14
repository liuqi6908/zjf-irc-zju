import type { ICms } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getCms<T>(cmsId: string) {
  return $get<ICms<T>>(`/cms/${cmsId}`)
}
