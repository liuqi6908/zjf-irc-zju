import { ErrorCode } from 'zjf-types'
import { Reflector } from '@nestjs/core'
import { ApiBearerAuth } from '@nestjs/swagger'
import { getReflectorValue } from 'src/utils/reflector-value'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { Injectable, UseGuards, applyDecorators } from '@nestjs/common'

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    // public readonly permissionSrv: PermissionService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()

    const loginRequired = getReflectorValue<boolean>(
      this.reflector,
      context,
      'loginRequired',
      true,
    )

    if (!req.raw.user && loginRequired)
      responseError(req.raw.accessTokenExpired ? ErrorCode.AUTH_LOGIN_EXPIRED : ErrorCode.AUTH_LOGIN_REQUIRED)
    return !!req.raw.user
  }
}

/**
 * 是否登录的守卫
 * @returns
 */
export function IsLogin() {
  return applyDecorators(
    UseGuards(LoginGuard),
    IsLoginApis(),
  )
}

export function IsLoginApis() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiErrorResponse(
      ErrorCode.AUTH_LOGIN_EXPIRED,
      ErrorCode.AUTH_LOGIN_REQUIRED,
    ),
  )
}
