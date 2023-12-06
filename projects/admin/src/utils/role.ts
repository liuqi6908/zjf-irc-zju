import type { PermissionType } from 'zjf-types'

/**
 * 根据角色粒子化权限返回后台菜单
 * @param permissions
 * @returns
 */
export function rolePermissionsToLabel(permissions: PermissionType[] = []) {
  return navList.filter(v => hasIntersection(v.permission, permissions))
    .map(v => v.name)
}

/**
 * 根据后台菜单返回角色粒子化权限
 * @param permissions
 * @returns
 */
export function labelToRolePermissions(permissions: string[] = []) {
  return expandArray(navList.filter(v => permissions.includes(v.name))
    .map(v => v.permission))
}
