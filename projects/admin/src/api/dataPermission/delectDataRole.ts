import { useRequest } from '../../composables/request'

const { $delete } = useRequest()

export function deleteRoles(roleName: string) {
  return $delete(`data-permission/data-role/${roleName}`)
}
