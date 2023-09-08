import type { IDesktop } from 'zjf-types'

const { $get } = useRequest()

/**
 * 查询当前用户分配的云桌面信息
 * @param body
 */
export function desktopQuery() {
  return $get<IDesktop>('desktop/own')
}
