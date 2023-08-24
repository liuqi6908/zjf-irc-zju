import { ErrorCode } from 'zjf-types'
import { HttpStatus } from '@nestjs/common'

const _exportErrors: ErrorMessageCollection = {
  [ErrorCode.EXPORT_DAILY_LIMIT_EXCEEDED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '今日外发次数已达上限',
  },
  [ErrorCode.EXPORT_SIZE_LIMIT_EXCEEDED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '文件尺寸超过上限',
  },
  [ErrorCode.EXPORT_FILE_NOT_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '文件不存在',
  },
  [ErrorCode.EXPORT_NOT_EXISTS]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '外发记录不存在',
  },
  [ErrorCode.EXPORT_HANDLED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '外发申请已处理，无法重复处理',
  },
}

export default _exportErrors
