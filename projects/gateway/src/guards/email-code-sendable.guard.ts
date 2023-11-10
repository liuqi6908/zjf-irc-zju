import { Reflector } from '@nestjs/core'
import { UserService } from 'src/modules/user/user.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { CodeAction, ErrorCode, codeActionDescriptions } from 'zjf-types'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'

@Injectable()
export class EmailCodeSendableGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly userSrv: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()

    const registerRequiredActions = [
      CodeAction.LOGIN,
      CodeAction.CHANGE_PASSWORD,
      CodeAction.UNBIND_EMAIL,
    ]

    const notRegisterRequiredActions = [
      CodeAction.REGISTER,
      CodeAction.BIND_EMAIL,
    ]

    const emailExistsRequiredActions = [
      CodeAction.UNBIND_EMAIL,
    ]
    const emailNotExistsRequiredActions = [
      // TODO: 目前，允许用户在存在邮箱的情况下，绑定新邮箱，但是不允许用户在不存在邮箱的情况下，解绑邮箱
      // CodeAction.BIND_EMAIL
    ]

    const actionIn = getReflectorValue(this.reflector, context, 'actionIn', 'body')
    const actionKey = getReflectorValue(this.reflector, context, 'actionKey', 'action')
    const emailIn = getReflectorValue(this.reflector, context, 'emailIn', 'body')
    const emailKey = getReflectorValue(this.reflector, context, 'emailKey', 'email')
    const registerPlatformIn = getReflectorValue(this.reflector, context, 'registerPlatformIn', 'body')
    const registerPlatformKey = getReflectorValue(this.reflector, context, 'registerPlatformKey', 'registerPlatform')

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

    let registerPlatform
    if (action === CodeAction.BIND_EMAIL)
      registerPlatform = req?.[registerPlatformIn]?.[registerPlatformKey]

    const queryParam: any = {
      where: { email },
    }
    if ([0, 1].includes(registerPlatform))
      queryParam.where.registerPlatform = registerPlatform

    const user = await this.userSrv.queryUser(queryParam)

    if (registerRequiredActions.includes(action) && !user)
      responseError(ErrorCode.USER_EMAIL_NOT_REGISTERED)

    if (notRegisterRequiredActions.includes(action) && user)
      responseError(ErrorCode.USER_EMAIL_REGISTERED)

    if (user && emailExistsRequiredActions.includes(action) && !user.email)
      responseError(ErrorCode.USER_EMAIL_NOT_EXISTS)

    if (user && emailNotExistsRequiredActions.includes(action) && user.email)
      responseError(ErrorCode.USER_EMAIL_EXISTS)

    if (action === CodeAction.UNBIND_EMAIL && user?.email !== email)
      responseError(ErrorCode.USER_EMAIL_NOT_MATCHED)

    return true
  }
}

/**
 * 确保 email + action 组合有效
 * @param action
 * @param email
 * @returns
 */
export function EmailCodeSendable(
  action?: { in?: 'body' | 'query'; key?: string },
  email?: { in?: 'body' | 'query'; key?: string },
) {
  return applyDecorators(
    UseGuards(EmailCodeSendableGuard),
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
