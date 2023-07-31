import { IPermission } from "./permission.interface";

/**
 * 用户角色，可自由 创建/删除 角色
 */
export interface IRole {
  /** 角色名称，作为唯一标识（主键） */
  name: string;

  /** 角色描述 */
  description?: string;

  /** 权限列表 */
  permissions?: IPermission[];
}