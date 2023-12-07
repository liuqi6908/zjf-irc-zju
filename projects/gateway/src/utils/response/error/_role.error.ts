import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _roleErrors: ErrorMessageCollection = {
  [ErrorCode.ROLE_DELETE_ROOT]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: 'root权限不可删除',
  },
  [ErrorCode.ROLE_UPDATE_ROOT]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: 'root权限不可更新',
  },
  [ErrorCode.ROLE_IN_USAGE]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '角色已被分配',
  },
}

export default _roleErrors
