import { HttpException, applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ErrorCode } from 'zjf-types'
import { errorMessages } from './error'

export function getErrorMessage(code: ErrorCode) {
  return errorMessages[code] || errorMessages[ErrorCode.COMMON_ERROR_CODE_NOT_DEFINED]
}

/**
 * 给客户端返回指定的错误
 * @param code
 * @param _detail
 */
export function responseError<T = any>(errorCode: ErrorCode, _detail?: T) {
  const errorMessage = getErrorMessage(errorCode)
  const message = errorMessage.message
  const detail = _detail ?? errorMessage.detail
  throw new HttpException(
    { status: errorCode, detail, message },
    errorMessage.httpStatus,
  )
}

/**
 * 返回统一格式的成功响应
 * @param data
 * @returns
 */
export function responseSuccess<T>(data: T) {
  return {
    status: 0,
    data: data === undefined ? null : data,
  }
}

/**
 * Swagger Api 响应错误修饰器
 * @param codes
 * @returns
 */
export function ApiErrorResponse(...codes: ErrorCode[]) {
  return applyDecorators(
    ...codes.map((code) => {
      const errorMessage
        = errorMessages[code]
        || errorMessages[ErrorCode.COMMON_ERROR_CODE_NOT_DEFINED]
      return ApiResponse({
        status: code as any,
        description: errorMessage.message,
      })
    }),
  )
}

/**
 * Swagger Api 响应成功修饰器
 * @param type
 * @returns
 */
export function ApiSuccessResponse(type: any) {
  return applyDecorators(
    ApiResponse({ status: 200, description: '成功', type }),
  )
}
