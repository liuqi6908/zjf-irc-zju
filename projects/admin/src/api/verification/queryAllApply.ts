import type { IPaginatedResData, IQueryDto, IVerificationHistory } from 'zjf-types'

const { $post } = useRequest()

export function queryAllApply(body: IQueryDto<IVerificationHistory>) {
  return $post<IPaginatedResData<IVerificationHistory>>('/verification/query', body)
}
