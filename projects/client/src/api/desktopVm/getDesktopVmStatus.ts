import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopVmStatus(desktopId: string) {
  return $get(`desktop-vm/${desktopId}`)
}
