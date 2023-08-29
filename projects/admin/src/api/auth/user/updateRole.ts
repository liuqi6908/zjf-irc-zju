import { useRequest } from '~/composables/request'

const { $patch } = useRequest()

export function updateRole(userId: string, roleName: string) {
  return $patch(`user/${userId}/role/${roleName}`)
}
