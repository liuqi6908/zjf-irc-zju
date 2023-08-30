import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopTimeHostCpu(hostId: string) {
  return $get(`desktop-host/time-series/${hostId}`)
}
