import type { IPaginatedResData, IQueryDto, IUser } from 'zjf-types'

const { $post } = useRequest()

export function searchUserQuery(body: IQueryDto<IUser>) {
  return $post<IPaginatedResData<IUser>>('/user/query', body)
}
