import { ErrorCode } from 'zjf-types'
import { Reflector } from '@nestjs/core'
import { ApiErrorResponse } from 'src/utils/response'
import { CodeService } from 'src/modules/code/code.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { CodeAction, ICodeVerifyDto, IEmailDto } from 'zjf-types'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'

interface BasicBody extends ICodeVerifyDto, IEmailDto {}

@Injectable()
export class EmailCodeVerifyGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly codeSrv: CodeService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    const action = getReflectorValue<CodeAction>(this.reflector, context, 'action', null)

    // TODO: 切换成可配置的以提升扩展性
    const body = req.body as any as BasicBody

    if (!action)
      throw new Error('action is required')

    await this.codeSrv.verifyWithError(body.bizId, [body.email, action, body.code])

    return true
  }
}

/**
 * 校验验证码是否正确
 * @param action
 * @returns
 */
export function EmailCodeVerify(action: CodeAction) {
  return applyDecorators(
    UseGuards(EmailCodeVerifyGuard),
    SetMetadata('action', action),
    ApiErrorResponse(ErrorCode.AUTH_CODE_NOT_MATCHED),
  )
}
