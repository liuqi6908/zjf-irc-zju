import { ErrorCode } from 'zjf-types'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { Injectable, UseGuards, applyDecorators } from '@nestjs/common'

import { LoginGuard } from './login.guard'

@Injectable()
export class VerifiedRequiredGuard
  extends LoginGuard
  implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    const user = req.raw.user
    if (!user)
      responseError(ErrorCode.AUTH_LOGIN_REQUIRED)
    const verified = !!user.verificationId
    if (!verified)
      responseError(ErrorCode.AUTH_NOT_VERIFIED)
    return true
  }
}

export function VerifiedRequired() {
  return applyDecorators(
    ApiErrorResponse(ErrorCode.AUTH_NOT_VERIFIED),
    UseGuards(VerifiedRequiredGuard),
  )
}
