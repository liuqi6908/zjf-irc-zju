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
  [ErrorCode.USER_EXISTED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户已存在',
  },
}

export default _userErrors
