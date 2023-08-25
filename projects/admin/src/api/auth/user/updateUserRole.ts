import { useRequest } from '~/composables/request'

const { $patch } = useRequest()

/** 关联认证信息 */
export function updateUserRole(userId: string, dataRoleNAme: string) {
  return $patch(`user/${userId}/data-role/${dataRoleNAme}`)
}
