import { Reflector } from '@nestjs/core'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { UserService } from 'src/modules/user/user.service'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { CodeAction, ErrorCode, codeActionDescriptions } from 'zjf-types'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'

@Injectable()
export class EmailCodeGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly userSrv: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()

    const registerRequiredActions = [
      CodeAction.LOGIN,
      CodeAction.CHANGE_PASSWORD,
    ]

    const notRegisterRequiredActions = [
      CodeAction.REGISTER,
    ]

    const actionIn = this.reflector.get<string>('actionIn', context.getHandler()) || 'body'
    const actionKey = this.reflector.get<string>('actionKey', context.getHandler()) || 'action'
    const emailIn = this.reflector.get<string>('emailIn', context.getHandler()) || 'body'
    const emailKey = this.reflector.get<string>('emailKey', context.getHandler()) || 'email'

    const email = req?.[emailIn]?.[emailKey]
    const action = req?.[actionIn]?.[actionKey]

    if (!action) {
      responseParamsError([{
        property: actionKey,
        constraints: { [actionKey]: 'action is required' },
      }])
    }

    if (!email) {
      responseParamsError([{
        property: emailKey,
        constraints: { [emailKey]: 'email is required' },
      }])
    }

    if (!codeActionDescriptions[action]) {
      responseParamsError([{
        property: actionKey,
        constraints: { [actionKey]: 'action is invalid' },
      }])
    }

    const user = await this.userSrv.queryUser({
      where: { email },
    })

    if (registerRequiredActions.includes(action) && !user)
      responseError(ErrorCode.USER_EMAIL_NOT_REGISTERED)

    if (notRegisterRequiredActions.includes(action) && user)
      responseError(ErrorCode.USER_EMAIL_REGISTERED)

    return true
  }
}

/**
 * 确保 email + action 组合有效
 * @param action
 * @param email
 * @returns
 */
export function EmailCodeVerify(
  action?: { in?: 'body' | 'query'; key?: string },
  email?: { in?: 'body' | 'query'; key?: string },
) {
  return applyDecorators(
    UseGuards(EmailCodeGuard),
    SetMetadata('actionIn', action?.in),
    SetMetadata('actionKey', action?.key),
    SetMetadata('emailIn', email?.in),
    SetMetadata('emailKey', email?.key),
    ApiErrorResponse(
      ErrorCode.USER_EMAIL_NOT_REGISTERED,
      ErrorCode.USER_EMAIL_REGISTERED,
    ),
  )
}
