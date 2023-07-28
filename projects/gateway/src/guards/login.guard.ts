import { ErrorCode } from 'zjf-types'
import { Reflector } from '@nestjs/core'
import { ApiBearerAuth } from '@nestjs/swagger'
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
    if (!req.raw.user)
      responseError(req.raw.accessTokenExpired ? ErrorCode.AUTH_LOGIN_EXPIRED : ErrorCode.AUTH_LOGIN_REQUIRED)

    // const getPermissions
    //   = this.reflector.get<boolean>('getUserPermissions', context.getHandler())
    //   || this.reflector.get<boolean>('getUserPermissions', context.getClass())

    // if (getPermissions && !req.permissions) {
    //   const user = req.raw.user
    //   const permissionGroup = user?.permissionGroupId
    //     ? await this.permissionSrv.findPermissionGroupById(
    //       user.permissionGroupId,
    //       { permissions: true },
    //     )
    //     : null
    //   const permissions = permissionGroup?.permissions || []
    //   req.permissions = permissions
    // }
    return true
  }
}

/**
 * 是否登录的守卫
 * @returns
 */
export function IsLogin() {
  return applyDecorators(
    UseGuards(LoginGuard),
    ApiBearerAuth(),
    ApiErrorResponse(
      ErrorCode.AUTH_LOGIN_EXPIRED,
      ErrorCode.AUTH_LOGIN_REQUIRED,
    ),
  )
}
