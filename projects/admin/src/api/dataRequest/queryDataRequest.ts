import type { IDataSuggestion, IQueryDto } from '../../../../../packages/zjf-types/dist/esm'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function queryDataRequest(options: IQueryDto<IDataSuggestion>) {
  return $post('data-suggest/query', options)
}
