import type { PermissionType } from 'zjf-types'

/**
 * 根据角色粒子化权限返回后台菜单
 * @param permissions
 * @returns
 */
export function rolePermissionsToLabel(permissions: PermissionType[] = []) {
  return permissionList.filter(v => hasIntersection(v.permission, permissions))
    .map(v => v.label)
}

/**
 * 根据后台菜单返回角色粒子化权限
 * @param permissions
 * @returns
 */
export function labelToRolePermissions(permissions: string[] = []) {
  return expandArray(permissionList.filter(v => permissions.includes(v.label))
    .map(v => v.permission))
}
