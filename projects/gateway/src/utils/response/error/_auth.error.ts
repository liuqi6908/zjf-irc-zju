import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _authErrors: ErrorMessageCollection = {
  [ErrorCode.AUTH_LOGIN_EXPIRED]: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: '登录已过期',
  },
  [ErrorCode.AUTH_LOGIN_REQUIRED]: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: '请登录后重试',
  },
  [ErrorCode.AUTH_PHONE_NUMBER_NOT_REGISTERED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '手机号码未注册',
  },
  [ErrorCode.AUTH_EMAIL_NOT_REGISTERED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '邮箱未注册',
  },
  [ErrorCode.AUTH_ACCOUNT_NOT_REGISTERED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '账号未注册',
  },
  [ErrorCode.AUTH_PASSWORD_NOT_MATCHED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '密码错误',
  },
}

export default _authErrors
