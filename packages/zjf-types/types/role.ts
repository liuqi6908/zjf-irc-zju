import { IPermission, IRole } from "./entities";
import { objectKeys } from '@catsjuice/utils';
import { PermissionType, permissionDescriptions } from "./permission";

const allPermissionNames = objectKeys(permissionDescriptions) as PermissionType[]

const getPermission = (name: PermissionType): IPermission => ({
  name,
  description: permissionDescriptions[name],
})

/**
 * 全部的默认权限
 */
export const defaultRoles: IRole[] = [
  {
    name: 'root',
    description: "完整的访问权限",
    permissions: allPermissionNames.map(pn => getPermission(pn))
  }
]

/**
 * 默认权限的映射表
 */
export const defaultRolesMap = defaultRoles.reduce((map, role) => {
  map[role.name] = role
  return map
}, {} as Record<string, IRole>)