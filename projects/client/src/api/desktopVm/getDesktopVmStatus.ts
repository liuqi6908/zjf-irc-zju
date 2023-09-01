import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export interface VMBaseInfo {
  architecture: string
  cpuNum: string
  /** 具体的系统名称 */
  guestOsType: string
  hypervisorType: string
  lastOpDate: string
  memorySize: string
  /** 系统类型 */
  platform: string
  state: 'Stopped' | 'Running'
  uuid: string
}

export function getDesktopVmStatus(desktopId: string) {
  return $get<VMBaseInfo>(`desktop-vm/${desktopId}`)
}
