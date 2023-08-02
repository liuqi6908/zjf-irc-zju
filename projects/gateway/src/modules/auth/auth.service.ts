import { Injectable } from '@nestjs/common'
import { CodeAction, ErrorCode } from 'zjf-types'
import { responseError } from 'src/utils/response'
import { comparePassword } from 'src/utils/encrypt/encrypt-password'

import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { objectOmit } from '@catsjuice/utils'
import { UserService } from '../user/user.service'
import { CodeService } from '../code/code.service'
import { JwtAuthService } from '../jwt-auth/jwt-auth.service'

import type { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'
import type { RegisterBodyDto } from './dto/register.body.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _userSrv: UserService,
    private readonly _jwtAuthSrv: JwtAuthService,
    private readonly _codeSrv: CodeService,
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
    return { sign, user: objectOmit(user, ['password']) }
  }

  /**
   * 自助注册
   * @param body
   */
  public async register(body: RegisterBodyDto) {
    // 校验 账号 是否被注册
    const user = await this._userSrv.qb().where('account = :account', { account: body.account }).getOne()
    if (user)
      responseError(ErrorCode.USER_ACCOUNT_REGISTERED)
    // 校验 邮箱 是否被注册
    // 理论上在发送验证码的时候已经校验过了，这里不需要校验，创建用户时如果冲突会抛出异常

    // 校验验证码
    const { bizId, code, ...userInfo } = body
    const { email } = userInfo
    const correct = await this._codeSrv.verifyCode(bizId, [email, CodeAction.REGISTER, code])
    if (!correct)
      responseError(ErrorCode.AUTH_CODE_NOT_MATCHED)

    // 创建用户
    try {
      const user = await this._userSrv.insertUser(userInfo)
      const sign = await this._jwtAuthSrv.signLoginAuthToken(user)
      return { sign, user: objectOmit(user, ['password']) }
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.USER_EXISTED, '邮箱或账号已被注册')
      throw e
    }
  }
}
