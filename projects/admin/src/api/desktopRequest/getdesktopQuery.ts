import type { IDesktop, IQueryConfig } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function getDesktopQuery(options: IQueryConfig<IDesktop>) {
  return $post('desktop-request/query', options)
}
