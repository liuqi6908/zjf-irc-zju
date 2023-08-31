import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function openDesktop(desktopId: string) {
  return $post(`desktop-vm/boot/${desktopId}`)
}
