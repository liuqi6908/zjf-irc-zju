import { HttpStatus } from '@nestjs/common';

const _authErrors: ErrorMessageCollection = {
  [ErrorCode.AUTH_LOGIN_EXPIRED]: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: '登录已过期',
  },
  [ErrorCode.AUTH_LOGIN_REQUIRED]: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: '请登录后重试',
  },
  [ErrorCode.AUTH_USERNAME_NOT_REGISTERED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '用户名未注册',
  },
  [ErrorCode.AUTH_PASSWORD_NOT_MATCHED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '密码错误',
  },
};

export default _authErrors;
