import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function resetDesktop(desktopId: string) {
  return $post(`desktop-vm/reboot/${desktopId}`, {})
}
