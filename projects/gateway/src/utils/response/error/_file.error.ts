import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _fileErrors: ErrorMessageCollection = {
  [ErrorCode.FILE_TYPE_NOT_ALLOWED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '文件类型不允许',
  },
  [ErrorCode.FILE_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '文无法找到指定的文件',
  },
}

export default _fileErrors
