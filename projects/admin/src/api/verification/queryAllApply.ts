import type { ILoginSuccessResData, IQueryDto, IVerificationHistory } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function queryAllApply(
  options: IQueryDto<IVerificationHistory>,
) {
  return $post<ILoginSuccessResData>('/verification/query', options)
}
