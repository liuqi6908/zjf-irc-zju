import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _dataErrors: ErrorMessageCollection = {
  [ErrorCode.DATA_PERMISSION_DELETE_VISITOR]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '访客角色不可删除',
  },
}

export default _dataErrors
