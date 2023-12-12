import { Cron } from '@nestjs/schedule'
import { Login } from 'src/entities/login'
import { objectOmit } from '@catsjuice/utils'
import type { User } from 'src/entities/user'
import { CodeAction, ErrorCode } from 'zjf-types'
import { responseError } from 'src/utils/response'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, MoreThan, Repository } from 'typeorm'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { comparePassword } from 'src/utils/encrypt/encrypt-password'

import { UserService } from '../user/user.service'
import { CodeService } from '../code/code.service'
import { EmailService } from '../email/email.service'
import { JwtAuthService } from '../jwt-auth/jwt-auth.service'

import type { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'
import type { RegisterBodyDto } from './dto/register.body.dto'
import type { LoginByEmailCodeBodyDto } from './dto/login-by-email-code.body.dto'
import type { LoginByEmailLinkDto } from './dto/login-by-email-link.body.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _codeSrv: CodeService,
    private readonly _emailSrv: EmailService,

    @Inject(forwardRef(() => UserService))
    private readonly _userSrv: UserService,
    @Inject(forwardRef(() => JwtAuthService))
    private readonly _jwtAuthSrv: JwtAuthService,
    @InjectRepository(Login)
    private readonly _loginRepo: Repository<Login>,
  ) {}

  @Cron('*/30 * * * * *')
  public async clearExpiredLogin() {
    await this._loginRepo.delete({
      expireAt: LessThan(new Date()),
    })
  }

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
    if (!user.password)
      responseError(ErrorCode.AUTH_PASSWORD_IS_NULL)

    // 校验密码
    const correct = await comparePassword(password, user.password)

    if (!correct)
      responseError(ErrorCode.AUTH_PASSWORD_NOT_MATCHED)

    // 签发 access_token
    return await this.signLoginTicket(user)
  }

  /**
   * 通过邮箱验证码登录
   * @param body
   * @returns
   */
  public async loginByEmailCode(body: LoginByEmailCodeBodyDto) {
    const { email, bizId, code } = body
    await this._codeSrv.verifyWithError(bizId, [email, CodeAction.LOGIN, code])

    const user = await this._userSrv.repo().findOne({ where: { email } })
    if (!user) {
      /** __EDGE_CASE__ */
      // 用户能够发送验证码到邮箱，说明用户已经注册了，但是在这里却找不到用户
      // 这种情况只能是发送验证码 -> 登录期间账号被删除了
      // 一般不会发生这一情况
      responseError(ErrorCode.AUTH_EMAIL_NOT_REGISTERED)
    }

    // 签发 access_token
    return await this.signLoginTicket(user)
  }

  /**
   * 通过邮箱链接登录
   * @param body
   */
  public async loginByEmailLink(body: LoginByEmailLinkDto) {
    const { email } = body
    const user = await this._userSrv.repo().findOne({ where: { email } })
    if (!user)
      responseError(ErrorCode.AUTH_EMAIL_NOT_REGISTERED)
    const { sign } = await this.signLoginTicket(user)
    await this._emailSrv.sendMagicLink(body, sign.access_token)
  }

  /**
   * 签发登录凭证
   * @param user
   * @returns
   */
  public async signLoginTicket(user: Partial<User>) {
    const sign = await this._jwtAuthSrv.signLoginAuthToken(user)
    return { sign, user: objectOmit(user, ['password']) }
  }

  /**
   * 将指定用户所有的会话都登出
   * @param userId
   */
  public async logoutUser(userId: string) {
    const logins = await this._loginRepo.find({
      where: { userId, expireAt: MoreThan(new Date()) },
    })
    for (const login of logins) {
      await this._jwtAuthSrv.destroyLoginAuthToken(login.token)
      await this._loginRepo.remove(login)
    }
  }

  /**
   * 自助注册（云科研平台）
   * @param body
   */
  public async register(body: RegisterBodyDto) {
    // 校验 账号 是否被注册
    const user = await this._userSrv.qb()
      .where('account = :account', { account: body.account })
      .getOne()
    if (user)
      responseError(ErrorCode.USER_ACCOUNT_REGISTERED)
    // 校验 邮箱 是否被注册
    // 理论上在发送验证码的时候已经校验过了，这里不需要校验，创建用户时如果冲突会抛出异常

    // 校验验证码
    const { bizId, code, ...userInfo } = body
    const { email } = userInfo
    await this._codeSrv.verifyWithError(bizId, [email, CodeAction.REGISTER, code])

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

  public loginRepo() {
    return this._loginRepo
  }

  public loginQB(alias = 'l') {
    return this._loginRepo.createQueryBuilder(alias)
  }
}
