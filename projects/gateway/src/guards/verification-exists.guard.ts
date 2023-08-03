import { ErrorCode } from 'zjf-types'
import { Reflector } from '@nestjs/core'
import { getReflectorValue } from 'src/utils/reflector-value'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { VerificationService } from 'src/modules/verification/verification.service'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'

@Injectable()
export class VerificationExistsGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly verificationSrv: VerificationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()

    const keyIn = getReflectorValue(this.reflector, context, 'keyIn', 'params')
    const keyName = getReflectorValue(this.reflector, context, 'keyName', 'verificationId')
    const nullable = getReflectorValue(this.reflector, context, 'nullable', false)
    const id = req?.[keyIn]?.[keyName] as string

    if (!id)
      return !!nullable

    const verification = await this.verificationSrv.repo().findOne({ where: { id } })

    if (!verification)
      responseError(ErrorCode.VERIFICATION_NOT_FOUND)

    req.verificationExistsGuardVerification = verification

    return true
  }
}

/**
 * 确认身份验证申请存在
 * @param keyIn
 * @param keyName
 * @param nullable
 * @returns
 */
export function VerificationExists(keyIn?: string, keyName?: string, nullable?: boolean) {
  return applyDecorators(
    SetMetadata('keyIn', keyIn),
    SetMetadata('keyName', keyName),
    SetMetadata('nullable', nullable),
    UseGuards(VerificationExistsGuard),
    ApiErrorResponse(ErrorCode.VERIFICATION_NOT_FOUND),
  )
}
