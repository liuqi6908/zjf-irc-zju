import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export interface VMBaseInfo {
  architecture: string
  cpuNum: number
  /** 具体的系统名称 */
  guestOsType: string
  hypervisorType: string
  lastOpDate: string
  memorySize: number
  /** 系统类型 */
  platform: string
  state: 'Starting' | 'Running' | 'Stopping' | 'Stopped' | 'Rebooting'
  uuid: string
}

export function getDesktopVmStatus(desktopId: string) {
  return $get<VMBaseInfo>(`desktop-vm/${desktopId}`)
}
