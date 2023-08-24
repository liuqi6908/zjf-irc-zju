import { useRequest } from '~/composables/request'

const { $delete } = useRequest()

export function stopDesktop(desktopId: string) {
  return $delete(`desktop/${desktopId}`)
}
