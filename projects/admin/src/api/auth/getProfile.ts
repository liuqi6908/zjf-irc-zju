import type { IUser } from 'zjf-types'

const { $get } = useRequest()

export function getProfile(relation: string) {
  return $get<IUser>('/user/profile/own', { relation })
}
