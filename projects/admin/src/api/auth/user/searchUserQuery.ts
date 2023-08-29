import type { IQueryDto, IUser } from 'zjf-types'
import { useRequest } from '~/composables/request'

const { $post } = useRequest()

export function searchUserQuery(options: IQueryDto<IUser>) {
  return $post('user/query', options)
}
