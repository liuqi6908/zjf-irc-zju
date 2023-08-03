import type { IUser } from 'zjf-types'

const { $get } = useRequest()

export function getProfile(relation?: string) {
  let url = '/user/profile/own'
  if (relation)
    url = `${url}/${relation}`

  return $get<IUser>(url)
}
