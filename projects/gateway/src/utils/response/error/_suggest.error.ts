import { ErrorCode } from 'zjf-types'
import { HttpStatus } from '@nestjs/common'

const _suggestError: ErrorMessageCollection = {
  [ErrorCode.DATA_SUGGEST_DUPLICATED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '重复的采购建议',
  },
}

export default _suggestError
