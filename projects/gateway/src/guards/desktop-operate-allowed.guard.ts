import { ErrorCode } from 'zjf-types'
import { Reflector } from '@nestjs/core'
import { responseError } from 'src/utils/response'
import { RoleService } from 'src/modules/role/role.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import { DesktopService } from 'src/modules/desktop/desktop.service'
import { type CanActivate, type ExecutionContext, Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'

import { IsLoginApis } from './login.guard'
import { PermissionGuard } from './permission.guard'

@Injectable()
export class DesktopOperateAllowed
  extends PermissionGuard
  implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly roleSrv: RoleService,
    public readonly desktopSrv: DesktopService,
  ) {
    super(reflector, roleSrv)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    await super.validatePermission(req, [], 'AND')

    const user = req.raw.user
    if (!user)
      responseError(ErrorCode.AUTH_LOGIN_REQUIRED)

    const desktopIdIn = getReflectorValue(this.reflector, context, 'desktopIdIn', 'params')
    const desktopIdKey = getReflectorValue(this.reflector, context, 'desktopIdKey', 'desktopId')
    const desktopId = req[desktopIdIn][desktopIdKey]

    const desktop = await this.desktopSrv.repo().findOne({ where: { id: desktopId } })
    if (!desktop)
      responseError(ErrorCode.DESKTOP_NOT_FOUND)

    if (desktop.userId !== user.id)
      responseError(ErrorCode.PERMISSION_DENIED)

    return true
  }
}

export function AllowDesktopOperate(
  keyIn = 'params',
  key = 'desktopId',
) {
  return applyDecorators(
    IsLoginApis(),
    SetMetadata('desktopIdIn', keyIn),
    SetMetadata('desktopIdKey', key),
    UseGuards(DesktopOperateAllowed),
  )
}
