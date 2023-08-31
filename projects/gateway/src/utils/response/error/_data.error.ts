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
  [ErrorCode.DATA_TABLE_MANIPULATE_ONLY]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '只能操作表格数据',
  },
  [ErrorCode.DATA_ROOT_CANNOT_DELETE_RELATED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '该大类下的数据已分配权限，无法删除，请先解绑权限',
  },
  [ErrorCode.DATA_ROLE_IN_USAGE]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '角色已被分配',
  },
}

export default _dataErrors
