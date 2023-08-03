export enum PermissionType {

  // ---------------- 超级管理员 -------------------
  // /** 
  //  * 完整的访问权限 
  //  * @deprecated 只能使用最细粒度的权限
  //  **/
  // ROOT = 'root',

  // ------------------- 账户 ---------------------
  /** 创建账户 */
  ACCOUNT_CREATE = 'account:create',
  /** 删除账户 */
  ACCOUNT_DELETE = 'account:delete',
  /** 更新账户的信息 */
  ACCOUNT_UPDATE = 'account:update',
  /** 查询账户（条件查找用户列表，获取用户信息） */
  ACCOUNT_QUERY = 'account:query',

  // ------------------ 身份验证 ---------------------
  /** 通过身份验证 */
  VERIFICATION_APPROVE = 'verification:approve',
  /** 驳回身份验证 */
  VERIFICATION_REJECT = 'verification:reject',
}

export const permissionDescriptions: Record<PermissionType, string> = {
  // [PermissionType.ROOT]: '完整的访问权限',
  [PermissionType.ACCOUNT_CREATE]: '创建账号',
  [PermissionType.ACCOUNT_DELETE]: '删除账号',
  [PermissionType.ACCOUNT_UPDATE]: '更新账号信息',
  [PermissionType.ACCOUNT_QUERY]: '查询账户（条件查找用户列表，获取用户信息）',

  [PermissionType.VERIFICATION_APPROVE]: '通过身份验证',
  [PermissionType.VERIFICATION_REJECT]: '驳回身份验证',
}