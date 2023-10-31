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
  /** 取消一个用户的认证 */
  VERIFICATION_CANCEL = 'verification:cancel',

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
  /** 创建数据大类 */
  DATA_ROOT_CREATE = 'data-root:create',
  /** 更新数据大类 */
  DATA_ROOT_UPDATE = 'data-root:update',
  /** 删除数据大类 */
  DATA_ROOT_DELETE = 'data-root:delete',

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

  // ------------------ 日志访问 ---------------------
  /** 查看日志 */
  LOG_VIEW = 'log:view',

  // ------------------ 云桌面-申请 ---------------------
  /** 查看云桌面申请附件 */
  DESKTOP_REQUEST_CAT_ATTACHMENT = 'desktop-request:cat-attachment',
  /** 创建云桌面申请 */
  DESKTOP_REQUEST_CREATE = 'desktop-request:create',
  /** 通过云桌面申请 */
  DESKTOP_REQUEST_APPROVE = 'desktop-request:approve',
  /** 驳回云桌面申请 */
  DESKTOP_REQUEST_REJECT = 'desktop-request:reject',
  /** 查询云桌面申请 */
  DESKTOP_REQUEST_QUERY = 'desktop-request:query',

  // ------------------ 云桌面-管理 ---------------------
  /** 创建云桌面 */
  DESKTOP_CREATE = 'desktop:create',
  /** 停用云桌面 */
  DESKTOP_DISABLE = 'desktop:disable',
  /** 更新云桌面 */
  DESKTOP_UPDATE = 'desktop:update',
  /** 删除云桌面 */
  DESKTOP_DELETE = 'desktop:delete',
  /** 分配云桌面给指定用户 */
  DESKTOP_ASSIGN = 'desktop:assign',
  /** 查询云桌面 */
  DESKTOP_QUERY = 'desktop:query',
  /** 云桌面过期检查 */
  DESKTOP_EXPIRE_CHECK = 'desktop:expire-check',


  // ------------------ 数据外发 ---------------------
  /** 查询所有大文件外发历史 */
  EXPORT_LG_QUERY_ALL = 'export-lg:query-all',
  /** 查询所有小文件外发历史 */
  EXPORT_SM_QUERY_ALL = "export-sm:query-all",
  /** 下载小文件外发的文件 */
  EXPORT_SM_DOWNLOAD = "export-sm:download",
  /** 通过大文件外发申请 */
  EXPORT_LG_APPROVE = 'export-lg:approve',
  /** 驳回大文件外发申请 */
  EXPORT_LG_REJECT = 'export-lg:reject',
  /** 下载大文件外发的文件 */
  EXPORT_LG_DOWNLOAD = 'export-lg:download',

  // ------------------ 作品/成果 ---------------------
  /** 查询所有作品/成果 */
  WORK_QUERY_ALL = 'work:query-all',
  /** 下载指定作品/成果的附件 */
  WORK_DOWNLOAD = 'work:download',

  // ------------------ 采购建议 ----–––---------------
  /** 查询所有的采购建议 */
  DATA_SUGGEST_QUERY_ALL = "data-suggest:query-all"
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
  [PermissionType.VERIFICATION_CANCEL]: '取消一个用户的认证',

  [PermissionType.CMS_CREATE]: '创建内容',
  [PermissionType.CMS_UPDATE]: '更新内容',
  [PermissionType.CMS_DELETE]: '删除内容',

  [PermissionType.DATA_UPLOAD]: '上传中间表',
  [PermissionType.DATA_UPLOAD_INTRO]: '上传数据库介绍',
  [PermissionType.DATA_EDIT_REFERENCE]: '编辑数据引用规范',
  [PermissionType.DATA_QUERY_ALL]: '查询所有的数据资源',
  [PermissionType.DATA_ROOT_CREATE]: '创建数据大类',
  [PermissionType.DATA_ROOT_UPDATE]: '更新数据大类',
  [PermissionType.DATA_ROOT_DELETE]: '删除数据大类',

  [PermissionType.DATA_PERMISSION_CREATE]: '创建数据角色',
  [PermissionType.DATA_PERMISSION_UPDATE]: '更新数据角色',
  [PermissionType.DATA_PERMISSION_DELETE]: '删除数据角色',
  [PermissionType.DATA_PERMISSION_QUERY]: '查询数据角色',
  [PermissionType.DATA_PERMISSION_UPDATE_REFERENCE]: '更新引用规范',

  [PermissionType.LOG_VIEW]: '查看日志',

  [PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT]: '查看云桌面申请附件',
  [PermissionType.DESKTOP_REQUEST_CREATE]: '创建云桌面申请',
  [PermissionType.DESKTOP_REQUEST_APPROVE]: '通过云桌面申请',
  [PermissionType.DESKTOP_REQUEST_REJECT]: '驳回云桌面申请',
  [PermissionType.DESKTOP_REQUEST_QUERY]: '查询云桌面申请',

  [PermissionType.DESKTOP_CREATE]: '创建云桌面',
  [PermissionType.DESKTOP_DISABLE]: '停用云桌面',
  [PermissionType.DESKTOP_UPDATE]: '更新云桌面',
  [PermissionType.DESKTOP_DELETE]: '删除云桌面',
  [PermissionType.DESKTOP_ASSIGN]: '分配云桌面给指定用户',
  [PermissionType.DESKTOP_QUERY]: '查询云桌面',
  [PermissionType.DESKTOP_EXPIRE_CHECK]: '云桌面过期检查',

  [PermissionType.EXPORT_LG_QUERY_ALL]: '查询所有大文件外发历史',
  [PermissionType.EXPORT_SM_QUERY_ALL]: '查询所有小文件外发历史',
  [PermissionType.EXPORT_SM_DOWNLOAD]: '下载小文件外发的文件',
  [PermissionType.EXPORT_LG_APPROVE]: '通过大文件外发申请',
  [PermissionType.EXPORT_LG_REJECT]: '驳回大文件外发申请',
  [PermissionType.EXPORT_LG_DOWNLOAD]: '下载大文件外发的文件',

  [PermissionType.WORK_QUERY_ALL]: '查询所有作品/成果',
  [PermissionType.WORK_DOWNLOAD]: '下载指定作品/成果的附件',

  [PermissionType.DATA_SUGGEST_QUERY_ALL]: '查询所有的采购建议',
}