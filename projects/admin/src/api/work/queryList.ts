import type { IQueryDto, IVerificationHistory } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function queryList(options: IQueryDto<IVerificationHistory>) {
  return $post('work/query', options)
}
