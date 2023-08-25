import type { IQueryDto, IVerificationHistory } from 'zjf-types'
import { useRequest } from '~/composables/request'

const { $post } = useRequest()

/** 关联认证信息 */
export function searchUserQuery(options: IQueryDto<IVerificationHistory>) {
  return $post('user/query', options)
}
