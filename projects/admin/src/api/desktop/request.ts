import type { IDesktopQueue, IPaginatedResData, IQueryConfig } from 'zjf-types'

const { $post } = useRequest()

/**
 * 查询云桌面申请列表
 */
export function desktopRequestQueryList(body: IQueryConfig<IDesktopQueue>) {
  return $post<IPaginatedResData<IDesktopQueue>>('desktop-request/query', body)
}

/**
 * 通过云桌面申请
 * @param id
 */
export function approveDesktop(id: string) {
  return $post(`desktop-request/approve/${id}`)
}

/**
 * 驳回云桌面申请
 * @param id
 * @param reason
 */
export function rejectDesktop(id: string, reason: string) {
  return $post(`desktop-request/reject/${id}`, { reason })
}
