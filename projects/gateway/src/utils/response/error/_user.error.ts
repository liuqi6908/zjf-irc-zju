import { ErrorCode } from 'zjf-types'
import { HttpStatus } from '@nestjs/common'

const _userErrors: ErrorMessageCollection = {
  [ErrorCode.USER_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '用户不存在',
  },
  [ErrorCode.USER_ACCOUNT_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '账号已被注册',
  },
  [ErrorCode.USER_EMAIL_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '邮箱已被注册',
  },
  [ErrorCode.USER_EMAIL_NOT_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '邮箱未注册',
  },
  [ErrorCode.USER_EXISTED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户已存在',
  },
  [ErrorCode.USER_EMAIL_NOT_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户未绑定邮箱',
  },
  [ErrorCode.USER_EMAIL_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户邮箱已存在',
  },
  [ErrorCode.USER_EMAIL_NOT_MATCHED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户邮箱不匹配',
  },
}

export default _userErrors
