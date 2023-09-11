export interface IRequest {
  name: string
  description: string
  downloadableDirectoryIds: string[]
  viewableDirectoryIds: string[]
}

export interface IDataRole {
  name: string
  description: string
  downloadDirectories?: any[]
  viewDirectories?: any[]
}

const { $get, $post, $patch, $delete } = useRequest()

/**
 * 查询所有数据下载角色
 */
export function queryDataRole() {
  return $get<Array<IDataRole>>('/data-permission/data-role/list')
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
  return $get<IDataRole>(`/data-permission/data-role/${name}`)
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
export function upsertDataRole(body: IRequest) {
  return $post('/data-permission/data-role/upsert', body)
}
