const enum ErrorCode {
  /** 未知错误 */
  COMMON_UNEXPECTED_ERROR = 100001,
  /** 参数校验错误 */
  COMMON_PARAMS_NOT_VALID = 100002,
  /** 未定义的错误码 */
  COMMON_ERROR_CODE_NOT_DEFINED = 100003,

  // ---- 用户相关错误码 ----
  /** 用户未登录 */
  AUTH_LOGIN_REQUIRED = 200001,
  AUTH_LOGIN_EXPIRED = 200002,
  AUTH_USERNAME_NOT_REGISTERED = 200003,
  AUTH_PASSWORD_NOT_MATCHED = 200004,

  // 权限相关错误
  PERMISSION_DENIED = 300001,

  // 用户相关
  USER_NOT_FOUND = 400001,
}

declare type ErrorMessageCollection = Partial<
  Record<
    ErrorCode,
    { httpStatus: import('@nestjs/common').HttpStatus; message: string }
  >
>;
