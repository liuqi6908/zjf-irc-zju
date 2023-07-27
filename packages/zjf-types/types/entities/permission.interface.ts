import { PermissionType } from "../permission";

/**
 * 权限列表，权限不可自由创建
 */
export interface IPermission {
  /** 权限 id */
  id: string;
  
  /** 权限的名称 */
  name: PermissionType;

  /** 权限的描述信息 */
  description?: string;
}