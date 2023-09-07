export enum ErrorCode {
  /** 未知错误 */
  COMMON_UNEXPECTED_ERROR = 100001,
  /** 参数校验错误 */
  COMMON_PARAMS_NOT_VALID = 100002,
  /** 未定义的错误码 */
  COMMON_ERROR_CODE_NOT_DEFINED = 100003,
  /** 未实现的功能 */
  COMMON_NOT_IMPLEMENTED = 100004,
  /** 已废弃的功能 */
  COMMON_DEPRECATED = 100005,

  // ---- 用户相关错误码 ----
  /** 用户未登录 */
  AUTH_LOGIN_REQUIRED = 200001,
  /** 登录过期 */
  AUTH_LOGIN_EXPIRED = 200002,
  /** 密码错误 */
  AUTH_PASSWORD_NOT_MATCHED = 200004,
  /** 手机号未注册 */
  AUTH_PHONE_NUMBER_NOT_REGISTERED = 200005,
  /** 邮箱未注册 */
  AUTH_EMAIL_NOT_REGISTERED = 200006,
  /** 账号未注册 */
  AUTH_ACCOUNT_NOT_REGISTERED = 200007,
  /** 验证码错误 */
  AUTH_CODE_NOT_MATCHED = 200008,
  /** 邮箱已注册 */
  AUTH_EMAIL_REGISTERED = 200009,
  /** 账号已注册 */
  AUTH_ACCOUNT_REGISTERED = 200010,
  /** 账号未完成认证 */
  AUTH_NOT_VERIFIED = 200011,

  // 权限相关错误
  PERMISSION_DENIED = 300001,

  // 用户相关
  USER_NOT_FOUND = 400001,
  /** 账号已注册 */
  USER_ACCOUNT_REGISTERED = 400002,
  /** 邮箱已注册 */
  USER_EMAIL_REGISTERED = 400003,
  /** 邮箱未注册 */
  USER_EMAIL_NOT_REGISTERED = 400004,
  /** 用户已存在 */
  USER_EXISTED = 400005,
  /** 用户未绑定邮箱 */
  USER_EMAIL_NOT_EXISTS = 400006,
  /** 用户邮箱已存在 */
  USER_EMAIL_EXISTS = 400007,
  /** 用户邮箱不匹配 */
  USER_EMAIL_NOT_MATCHED = 400008,

  // 身份验证相关 
  /** 驳回原因必填 */
  VERIFICATION_REJECT_REASON_REQUIRED = 500001,
  /** 已存在待处理的身份验证 */
  VERIFICATION_PENDING_EXISTS = 500002,
  /** 认证申请不存在 */
  VERIFICATION_NOT_FOUND = 500003,
  /** 认证申请不是待处理状态 */
  VERIFICATION_NOT_PENDING = 500004,
  /** 认证申请不是通过状态 */
  VERIFICATION_NOT_APPROVED = 500005,

  // 文件相关错误
  /** 文件类型不允许 */ 
  FILE_TYPE_NOT_ALLOWED = 600001,
  /** 文件不存在 */
  FILE_NOT_FOUND = 600002,
  /** 文件大小超出限制 */
  FILE_TOO_LARGE = 600003,


  // 数据相关错误
  /** 禁止删除访客角色 */
  DATA_PERMISSION_DELETE_VISITOR = 700001,
  /** 数据目录不存在 */
  DATA_DIRECTORY_NOT_FOUND = 700002,
  /** 仅表格可操作 */
  DATA_TABLE_MANIPULATE_ONLY = 700003,
  /** 该大类下的数据已分配权限，无法删除，请先解绑权限 */
  DATA_ROOT_CANNOT_DELETE_RELATED = 700004,
  /** 角色已被分配 */
  DATA_ROLE_IN_USAGE = 700005,

  // 云桌面相关错误
  /** 存在待审核状态的云桌面申请 */
  DESKTOP_REQUEST_PENDING_EXISTS = 800001,
  /** 存在排队中的云桌面申请 */
  DESKTOP_REQUEST_QUEUE_EXISTS = 800002,
  /** 存在正在使用中的云桌面 */
  DESKTOP_REQUEST_IN_USE_EXISTS = 800003, 
  /** 仅待审核状态允许被操作 */
  DESKTOP_REQUEST_PENDING_ONLY = 800004,
  /** 仅排队状态允许被操作 */
  DESKTOP_REQUEST_QUEUE_ONLY = 800005,
  /** 云桌面 id 已存在 */
  DESKTOP_ID_EXISTS = 800006,
  /** 云桌面不存在 */
  DESKTOP_NOT_FOUND = 800007,
  /** 正在进行云桌面过期检查中，无法重复进行 */
  DESKTOP_EXPIRE_CHECKING = 800008,
  /** 云桌面已被分配 */
  DESKTOP_ALREADY_ASSIGNED = 800009,
  /** 用户已分配了其他的云桌面 */
  DESKTOP_USER_ASSIGNED_OTHERS = 800010,

  // 外发相关错误
  /** 当日的外发次数已达上限 */
  EXPORT_DAILY_LIMIT_EXCEEDED = 900001,
  /** 外发文件大小超出限制 */
  EXPORT_SIZE_LIMIT_EXCEEDED = 900002,
  /** 外发文件不存在 */
  EXPORT_FILE_NOT_EXISTS = 900003,
  /** 外发记录不存在 */
  EXPORT_NOT_EXISTS = 900004,
  /** 外发申请已处理，无法重复处理 */
  EXPORT_HANDLED = 900005,

  // 建议采购相关错误
  /** 重复的采购建议 */
  DATA_SUGGEST_DUPLICATED = 110001
}

export type ErrorMessageCollection = Partial<
  Record<
    ErrorCode,
    { 
      httpStatus: import('@nestjs/common').HttpStatus; 
      message: string;
      detail?: any;
    }
  >
>;
