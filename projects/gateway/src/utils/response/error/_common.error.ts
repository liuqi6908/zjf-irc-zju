import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _commonError: ErrorMessageCollection = {
  [ErrorCode.COMMON_PARAMS_NOT_VALID]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '参数校验错误',
  },
  [ErrorCode.COMMON_UNEXPECTED_ERROR]: {
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '发生未知错误',
  },
  [ErrorCode.COMMON_ERROR_CODE_NOT_DEFINED]: {
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '发生未知错误',
  },
}

export default _commonError
