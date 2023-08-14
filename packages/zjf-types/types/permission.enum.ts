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
  /** 查看所有的身份验证申请 */
  VERIFICATION_LIST_ALL = 'verification:list-all',
  /** 查看上传的附件 */
  VERIFICATION_CAT_ATTACHMENT = 'verification:cat-attachment',
  /** 通过身份验证 */
  VERIFICATION_APPROVE = 'verification:approve',
  /** 驳回身份验证 */
  VERIFICATION_REJECT = 'verification:reject',

  // ------------------ 内容管理 ---------------------
  /** 创建内容 */
  CMS_CREATE = 'cms:create',
  /** 更新内容 */
  CMS_UPDATE = 'cms:update',
  /** 删除内容 */
  CMS_DELETE = 'cms:delete',
}

export const permissionDescriptions: Record<PermissionType, string> = {
  // [PermissionType.ROOT]: '完整的访问权限',
  [PermissionType.ACCOUNT_CREATE]: '创建账号',
  [PermissionType.ACCOUNT_DELETE]: '删除账号',
  [PermissionType.ACCOUNT_UPDATE]: '更新账号信息',
  [PermissionType.ACCOUNT_QUERY]: '查询账户（条件查找用户列表，获取用户信息）',

  [PermissionType.VERIFICATION_LIST_ALL]: '查看所有的身份验证申请',
  [PermissionType.VERIFICATION_CAT_ATTACHMENT]: '查看上传的附件',
  [PermissionType.VERIFICATION_APPROVE]: '通过身份验证申请',
  [PermissionType.VERIFICATION_REJECT]: '驳回身份验证申请',

  [PermissionType.CMS_CREATE]: '创建内容',
  [PermissionType.CMS_UPDATE]: '更新内容',
  [PermissionType.CMS_DELETE]: '删除内容',
}