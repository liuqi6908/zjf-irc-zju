import type { IPaginatedResData, IQueryDto, IWork } from 'zjf-types'

const { $get, $post } = useRequest()

export function queryList(options: IQueryDto<IWork>) {
  return $post<IPaginatedResData<IWork>>('work/query', options)
}

export function download(id: string) {
  return $get(`work/file/${id}`, null, false, { responseType: 'blob' })
}
