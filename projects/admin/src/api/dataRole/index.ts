import type { IDataRole, IUpsertDataRoleBodyDto } from 'zjf-types'

export interface IRequest {
  name: string
  description: string
  select: boolean
  sort: number
  downloadDirectories?: any[]
  viewDirectories?: any[]
}

const { $get, $post, $patch, $delete } = useRequest()

/**
 * 查询所有数据下载角色
 */
export function queryDataRole() {
  return $get<IDataRole[]>('/data-permission/data-role/list')
}

/**
 * 更新指定用户的数据角色
 * @param id
 * @param name
 */
export function updateUserDataRole(id: string, name: string) {
  return $patch(`/user/${id}/data-role/${name}`)
}

/**
 * 查询指定数据下载角色详情
 * @param name
 */
export function queryDataRoleInfo(name: string) {
  return $get<IRequest>(`/data-permission/data-role/${name}`)
}

/**
 * 删除指定数据下载角色
 * @param name
 */
export function deleteDataRole(name: string) {
  return $delete(`/data-permission/data-role/${name}`)
}

/**
 * 插入/更新数据下载角色
 * @param body
 */
export function upsertDataRole(body: IUpsertDataRoleBodyDto) {
  return $post('/data-permission/data-role/upsert', body)
}
