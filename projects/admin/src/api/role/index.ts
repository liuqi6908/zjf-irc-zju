import type { IRole, IUpsertRoleBodyDto } from 'zjf-types'

const { $get, $post, $delete, $patch } = useRequest()

/**
 * 获取全部角色列表
 * @returns
 */
export function getRoles() {
  return $get<IRole[]>('/role/list')
}

/**
 * 创建/更新角色
 * @param body
 * @returns
 */
export function upsertRole(body: IUpsertRoleBodyDto) {
  return $post<IRole>('/role/upsert', body)
}

/**
 * 删除角色
 * @param name
 * @returns
 */
export function deleteRoleByName(name: string) {
  return $delete<number>(`/role/${name}`)
}

/**
 * 更新指定用户的角色
 * @param id
 * @param name
 * @returns
 */
export function updateUserRole(id: string, name: string) {
  return $patch<number>(`/user/${id}/role/${name}`)
}
