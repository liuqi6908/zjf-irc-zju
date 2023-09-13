import type { IDataSuggestion, IPaginatedResData, IQueryDto } from 'zjf-types'

const { $post } = useRequest()

export function queryDataRequest(options: IQueryDto<IDataSuggestion>) {
  return $post<IPaginatedResData<IDataSuggestion>>('data-suggest/query', options)
}
