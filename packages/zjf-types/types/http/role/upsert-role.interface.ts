import { PermissionType } from '../../permission.enum'

export interface IUpsertRoleBodyDto {
  /** 角色名称，作为唯一标识（主键） */
  name: string

  /** 角色描述 */
  description?: string

  /** 权限列表 */
  permissions?: PermissionType[];
}