import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _desktopErrors: ErrorMessageCollection = {
  [ErrorCode.DESKTOP_REQUEST_PENDING_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '存在待审核状态的云桌面申请',
  },
  [ErrorCode.DESKTOP_REQUEST_QUEUE_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '存在排队中的云桌面申请',
  },
  [ErrorCode.DESKTOP_REQUEST_IN_USE_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '存在正在使用中的云桌面',
  },
  [ErrorCode.DESKTOP_REQUEST_PENDING_ONLY]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '仅待审核状态允许被操作',
  },
  [ErrorCode.DESKTOP_REQUEST_QUEUE_ONLY]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '仅排队状态允许被操作',
  },
  [ErrorCode.DESKTOP_ID_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '云桌面 id 已存在',
  },
  [ErrorCode.DESKTOP_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '云桌面不存在',
  },
  [ErrorCode.DESKTOP_EXPIRE_CHECKING]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '正在进行云桌面过期检查中，无法重复进行',
  },
}

export default _desktopErrors
