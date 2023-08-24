import type { IDesktopQueueHistory, IQueryConfig } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function getDesktopQuery(options: IQueryConfig<IDesktopQueueHistory>) {
  return $post('desktop-request/query', options)
}
