import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _dataErrors: ErrorMessageCollection = {
  [ErrorCode.DATA_PERMISSION_DELETE_VISITOR]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '访客角色不可删除',
  },
  [ErrorCode.DATA_DIRECTORY_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '所查询的资源已被移除',
  },
}

export default _dataErrors
