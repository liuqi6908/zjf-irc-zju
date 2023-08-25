import type { IDesktopQueueHistory, IQueryConfig } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function desktopQueryList(options: IQueryConfig<IDesktopQueueHistory>) {
  return $post('desktop/query', options)
}
