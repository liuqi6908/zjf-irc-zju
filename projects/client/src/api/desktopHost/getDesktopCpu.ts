import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopHostCpu(hostId: string) {
  return $get(`desktop-host/${hostId}`)
}
