import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { responseError } from 'src/utils/response'
import { ErrorCode, PermissionType } from 'zjf-types'
import { RoleService } from 'src/modules/role/role.service'
import { type CanActivate, type ExecutionContext, Injectable, UseGuards, applyDecorators } from '@nestjs/common'

import { ApiBearerAuth } from '@nestjs/swagger'
import { PermissionGuard } from './permission.guard'

@Injectable()
export class LogAccessPermission extends PermissionGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly roleSrv: RoleService,
    public readonly cfgSrv: ConfigService,
  ) {
    super(reflector, roleSrv)
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    await super.validatePermission(req, [], 'AND')

    const user = req.raw.user

    const hasPermission = user?.role?.permissions?.some(p => p.name === PermissionType.LOG_VIEW)
    if (hasPermission)
      return true

    const accessToken = req.headers['x-access-token'] as string

    if (accessToken === this.cfgSrv.get('ACCESS_KEY_LOG'))
      return true

    responseError(ErrorCode.PERMISSION_DENIED)
  }
}

export function HasLogAccess() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(LogAccessPermission),
  )
}
