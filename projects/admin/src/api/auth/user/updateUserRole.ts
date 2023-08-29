import { useRequest } from '~/composables/request'

const { $patch } = useRequest()

export function updateUserRole(userId: string, dataRoleNAme: string) {
  return $patch(`user/${userId}/data-role/${dataRoleNAme}`)
}
