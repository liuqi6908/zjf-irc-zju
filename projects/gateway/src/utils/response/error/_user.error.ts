import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _userErrors: ErrorMessageCollection = {
  [ErrorCode.USER_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '用户不存在',
  },
}

export default _userErrors
