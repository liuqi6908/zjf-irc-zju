import { ModuleRef } from '@nestjs/core'
import type { NestMiddleware } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'

import type { User } from 'src/entities/user'
import { UserService } from 'src/modules/user/user.service'
import { JwtAuthService } from '../modules/jwt-auth/jwt-auth.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name)

  constructor(private readonly _modRef: ModuleRef) {}

  private _readTokenFromBearAuthHeader(authHeader: string): string {
    return authHeader && authHeader.replace(/^Bearer\s(\S*)$/, '$1')
  }

  async use(req: FastifyRequest, res: any, next: () => void) {
    let query
    try {
      query = req.url
        .split('?')
        .pop()
        .split('&')
        .reduce((dict, curr) => {
          const [key, value] = curr.split('=')
          dict[key] = value
          return dict
        }, {})
    }
    catch (err) {}

    const authHeader = (req?.headers as any)?.authorization

    const access_token
      = this._readTokenFromBearAuthHeader(authHeader) || query.token

    if (!access_token) {
      next()
      return
    }
    const _jwtAuthSrv = this._modRef.get(JwtAuthService, { strict: false })
    const _userSrv = this._modRef.get(UserService, { strict: false })
    let info, user: User

    try {
      info = await _jwtAuthSrv.validateLoginAuthToken(access_token)
    }
    catch (err) {
      req.accessTokenExpired = true
      this.logger.error('解析 access_token 时出现错误', err)
    }
    try {
      const userId = info?.id
      user = await _userSrv.qb().where('id = :id', { id: userId }).getOne()
    }
    catch (err) {
      this.logger.error('获取用户信息时出现错误', err)
    }
    if (!user)
      return next()

    if (user.isDeleted) {
      this.logger.error(`用户 ${user.phone}, ${user.id} 已被删除，无法登录`)
      return next()
    }
    // 比较数据库内的用户手机号与 access_token 解析的手机号是否一致
    if (info?.phone && info?.phone === user.phone) {
      req.user = user
    }
    else {
      // 如果手机号不一致，判定用户已更新了手机号，旧的登录授权 token 全部销毁
      req.accessTokenExpired = true
      this.logger.warn(
        `User[${info?.id}]'s phone in db[${user.phone}] not match phone in token[${info.phone}]`,
      )
      // 直接销毁 token
      try {
        _jwtAuthSrv.destroyLoginAuthToken(access_token)
      }
      catch (err) {
        this.logger.error('Error destroying access_token', err)
      }
    }
    next()
  }
}
