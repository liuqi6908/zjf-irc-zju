import { objectKeys } from '@catsjuice/utils';

import { IRole } from "./entities/role.interface";
import { IPermission } from "./entities/permission.interface";
import { PermissionType, permissionDescriptions } from "./permission.enum";

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
  },
  {
    name: "超级管理员",
    description: "所有的管理权限",
    permissions: [
      PermissionType.VERIFICATION_LIST_ALL,
      PermissionType.VERIFICATION_APPROVE,
      PermissionType.VERIFICATION_REJECT,
    ].map(pn => getPermission(pn))
  }
]

/**
 * 默认权限的映射表
 */
export const defaultRolesMap = defaultRoles.reduce((map, role) => {
  map[role.name] = role
  return map
}, {} as Record<string, IRole>)