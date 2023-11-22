import { ErrorCode } from 'zjf-types'
import { ConfigService } from '@nestjs/config'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { Injectable, UseGuards, applyDecorators } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { LoginGuard } from './login.guard'

@Injectable()
export class VerifiedRequiredGuard
  extends LoginGuard
  implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly cfgSrv: ConfigService,
  ) {
    super(reflector)
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()

    const accessToken = req.headers['x-access-token'] as string
    if (accessToken === this.cfgSrv.get('ACCESS_KEY_LOG'))
      return true

    const user = req.raw.user
    if (!user)
      responseError(ErrorCode.AUTH_LOGIN_REQUIRED)
    const verified = !!user.verificationId
    if (!verified)
      responseError(ErrorCode.AUTH_NOT_VERIFIED)
    return true
  }
}

export function VerifiedRequiredToken() {
  return applyDecorators(
    ApiErrorResponse(ErrorCode.AUTH_NOT_VERIFIED),
    UseGuards(VerifiedRequiredGuard),
  )
}
