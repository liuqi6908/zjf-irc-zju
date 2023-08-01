import { ErrorCode } from 'zjf-types'
import { Injectable } from '@nestjs/common'
import { responseError } from 'src/utils/response'
import { comparePassword } from 'src/utils/encrypt/encrypt-password'

import { UserService } from '../user/user.service'
import { JwtAuthService } from '../jwt-auth/jwt-auth.service'

import type { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _userSrv: UserService,
    private readonly _jwtAuthSrv: JwtAuthService,

  ) {}

  /**
   * 通过账号密码登录，校验并签发 access_token
   * @param body
   * @returns
   */
  public async loginByPassword(body: LoginByPasswordBodyDto) {
    const { account, email, password } = body
    if (!account && !email)
      throw new Error('手机号码或邮箱地址至少需要填写一个')
    const qb = this._userSrv.qb().addSelect('u.password')
    if (account)
      qb.where('account = :account', { account })
    else if (email)
      qb.where('email = :email', { email })
    const user = await qb.getOne()
    if (!user) {
      responseError(
        account
          ? ErrorCode.AUTH_ACCOUNT_NOT_REGISTERED
          : ErrorCode.AUTH_EMAIL_NOT_REGISTERED,
      )
    }

    // 校验密码
    const correct = await comparePassword(password, user.password)

    if (!correct)
      responseError(ErrorCode.AUTH_PASSWORD_NOT_MATCHED)

    // 签发 access_token
    const sign = await this._jwtAuthSrv.signLoginAuthToken(user)
    return { sign, user: { ...user, password: undefined } }
  }
}
