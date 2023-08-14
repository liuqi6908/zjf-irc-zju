import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _fileErrors: ErrorMessageCollection = {
  [ErrorCode.FILE_TYPE_NOT_ALLOWED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '文件类型不允许',
  },
}

export default _fileErrors
