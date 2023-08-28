import type { IDesktop, IQueryConfig } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function desktopQueryList(options: IQueryConfig<IDesktop>) {
  return $post('desktop/query', options)
}
