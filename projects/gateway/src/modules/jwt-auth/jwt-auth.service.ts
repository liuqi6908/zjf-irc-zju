import { ErrorCode } from 'zjf-types'
import { JwtService } from '@nestjs/jwt'
import { objectPick } from '@catsjuice/utils'
import { ConfigService } from '@nestjs/config'
import { responseError } from 'src/utils/response'
import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { md5 } from 'src/utils/encrypt/md5'
import { AuthService } from '../auth/auth.service'
import { RedisService } from '../redis/redis.service'

import type { User } from '../../entities/user'

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly _jwtSrv: JwtService,
    private readonly _cfgSrv: ConfigService,
    private readonly _redisSrv: RedisService,

    @Inject(forwardRef(() => AuthService))
    private readonly _authSrv: AuthService,
  ) {}

  /**
   * 根据用户签发登录成功的授权token
   * @param user
   * @returns
   */
  public async signLoginAuthToken(user: Partial<User>) {
    const expiresIn = this._cfgSrv.get<number>('jwt.loginAuthExpireInSeconds')
    const secret = this._cfgSrv.get<string>('jwt.loginAuthSecret')
    const signObj = objectPick(user, ['id', 'account', 'email', 'nickname'], true)
    const access_token = this._jwtSrv.sign(signObj, { secret, expiresIn })
    const client = await this._redisSrv.getClient(RedisType.AUTH_JWT)
    client.setEx(access_token, expiresIn, `${expiresIn}`)

    // 存储token
    this._authSrv.loginRepo().insert({
      id: md5(access_token),
      token: access_token,
      userId: user.id,
      expireAt: new Date(Date.now() + expiresIn * 1000),
      lastActiveAt: new Date(),
    })
    return { access_token, expireAt: Date.now() + expiresIn }
  }

  /**
   * 校验签发的用户授权 token
   * @param token
   */
  public async validateLoginAuthToken(token: string) {
    // 1. 检查 redis
    try {
      const client = await this._redisSrv.getClient(RedisType.AUTH_JWT)
      const exists = await client.exists(token)
      if (!exists)
        return
    }
    catch (err) {
      // this.logger.error('从redis读取access_token时出现错误', err);
      return
    }

    // 2. 检查 token 是否有效
    return this._jwtSrv.verifyAsync(token, {
      secret: this._cfgSrv.get<string>('jwt.loginAuthSecret'),
    })
  }

  /**
   * 删除指定的token
   * @param token
   * @returns
   */
  public async destroyLoginAuthToken(token: string) {
    const client = await this._redisSrv.getClient(RedisType.AUTH_JWT)
    try {
      const exists = await client.exists(token)
      if (!exists)
        throw new Error('AccessToken not exists in cache')

      // 删除数据库中存储的 token
      this._authSrv.loginRepo().delete({ id: md5(token) })
    }
    catch (err) {
      responseError(ErrorCode.AUTH_LOGIN_EXPIRED)
    }
    client.del(token)
    return true
  }
}
