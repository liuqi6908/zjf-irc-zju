export enum ErrorCode {
  /** 未知错误 */
  COMMON_UNEXPECTED_ERROR = 100001,
  /** 参数校验错误 */
  COMMON_PARAMS_NOT_VALID = 100002,
  /** 未定义的错误码 */
  COMMON_ERROR_CODE_NOT_DEFINED = 100003,

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


  // 数据相关错误
  /** 禁止删除访客角色 */
  DATA_PERMISSION_DELETE_VISITOR = 700001,
  /** 数据目录不存在 */
  DATA_DIRECTORY_NOT_FOUND = 700002,
  /** 仅表格可操作 */
  DATA_TABLE_MANIPULATE_ONLY = 700003,
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
