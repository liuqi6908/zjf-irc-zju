import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopVmDetail(desktopId: string) {
  return $get(`desktop-vm/detail/${desktopId}`)
}
