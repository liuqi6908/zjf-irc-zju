import { useRequest } from '~/composables/request'

const { $patch } = useRequest()
export function assignDesktop(desktopId: string, userId: string) {
  return $patch(`desktop/${desktopId}/assign/${userId}`)
}
