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

  // 权限相关错误
  PERMISSION_DENIED = 300001,

  // 用户相关
  USER_NOT_FOUND = 400001,
  /** 账号已注册 */
  USER_ACCOUNT_REGISTERED = 400002,
  /** 邮箱已注册 */
  USER_EMAIL_REGISTERED = 400003,
  /** 用户已存在 */
  USER_EXISTED = 400004,
}

export type ErrorMessageCollection = Partial<
  Record<
    ErrorCode,
    { httpStatus: import('@nestjs/common').HttpStatus; message: string }
  >
>;
