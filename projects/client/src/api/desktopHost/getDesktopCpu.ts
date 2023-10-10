import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopHostCpu(hostId: string) {
  return $get(`desktop-host/${hostId}`)
}

export function getDesktopHostStorage() {
  return $get('desktop-host/cluster/storage')
}
