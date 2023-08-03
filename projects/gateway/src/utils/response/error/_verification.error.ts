import { ErrorCode } from 'zjf-types'
import { HttpStatus } from '@nestjs/common'

const _verificationErrors: ErrorMessageCollection = {
  [ErrorCode.VERIFICATION_REJECT_REASON_REQUIRED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '请提供驳回原因',
  },
  [ErrorCode.VERIFICATION_PENDING_EXISTS]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '已存在待处理的身份验证',
  },
  [ErrorCode.VERIFICATION_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '身份认证申请不存在',
  },
  [ErrorCode.VERIFICATION_NOT_PENDING]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '身份认证申请不是待处理状态',
    detail: '如果需要重置认证，请使用重置认证的接口',
  },
  [ErrorCode.VERIFICATION_NOT_APPROVED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '身份认证申请不是通过状态',
  },
}

export default _verificationErrors
