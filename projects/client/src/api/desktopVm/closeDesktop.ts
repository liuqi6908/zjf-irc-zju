import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function closeDesktop(desktopId: string) {
  return $post(`desktop-vm/shutdown/${desktopId}`)
}
