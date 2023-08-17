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
  /** 更新指定用户的角色 */
  ACCOUNT_UPDATE_ROLE = 'account:update-role',
  /** 更新指定用户的数据角色 */
  ACCOUNT_UPDATE_DATA_ROLE = 'account:update-data-role',

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

  // ------------------ 数据管理-资源 ---------------------
  /** 上传中间表 */
  DATA_UPLOAD = 'data:upload',
  /** 上传数据库介绍 */
  DATA_UPLOAD_INTRO = 'data:upload-intro',
  /** 编辑数据引用规范 */
  DATA_EDIT_REFERENCE = 'data:edit-reference',
  /** 查询所有的数据资源 */
  DATA_QUERY_ALL = 'data:query-all',

  // ------------------ 数据管理-权限 ---------------------
  /** 创建数据角色 */
  DATA_PERMISSION_CREATE = 'data-permission:create',
  /** 更新数据角色 */
  DATA_PERMISSION_UPDATE = 'data-permission:update',
  /** 删除数据角色 */
  DATA_PERMISSION_DELETE = 'data-permission:delete',
  /** 查询数据角色 */
  DATA_PERMISSION_QUERY = 'data-permission:query',
  /** 更新引用规范 */
  DATA_PERMISSION_UPDATE_REFERENCE = 'data-permission:update-reference',
}

export const permissionDescriptions: Record<PermissionType, string> = {
  // [PermissionType.ROOT]: '完整的访问权限',
  [PermissionType.ACCOUNT_CREATE]: '创建账号',
  [PermissionType.ACCOUNT_DELETE]: '删除账号',
  [PermissionType.ACCOUNT_UPDATE]: '更新账号信息',
  [PermissionType.ACCOUNT_QUERY]: '查询账户（条件查找用户列表，获取用户信息）',
  [PermissionType.ACCOUNT_UPDATE_ROLE]: '更新指定用户的角色',
  [PermissionType.ACCOUNT_UPDATE_DATA_ROLE]: '更新指定用户的数据角色',

  [PermissionType.VERIFICATION_LIST_ALL]: '查看所有的身份验证申请',
  [PermissionType.VERIFICATION_CAT_ATTACHMENT]: '查看上传的附件',
  [PermissionType.VERIFICATION_APPROVE]: '通过身份验证申请',
  [PermissionType.VERIFICATION_REJECT]: '驳回身份验证申请',

  [PermissionType.CMS_CREATE]: '创建内容',
  [PermissionType.CMS_UPDATE]: '更新内容',
  [PermissionType.CMS_DELETE]: '删除内容',

  [PermissionType.DATA_UPLOAD]: '上传中间表',
  [PermissionType.DATA_UPLOAD_INTRO]: '上传数据库介绍',
  [PermissionType.DATA_EDIT_REFERENCE]: '编辑数据引用规范',
  [PermissionType.DATA_QUERY_ALL]: '查询所有的数据资源',

  [PermissionType.DATA_PERMISSION_CREATE]: '创建数据角色',
  [PermissionType.DATA_PERMISSION_UPDATE]: '更新数据角色',
  [PermissionType.DATA_PERMISSION_DELETE]: '删除数据角色',
  [PermissionType.DATA_PERMISSION_QUERY]: '查询数据角色',
  [PermissionType.DATA_PERMISSION_UPDATE_REFERENCE]: '更新引用规范',
}