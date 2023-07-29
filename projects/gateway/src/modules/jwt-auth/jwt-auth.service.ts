import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { responseError } from 'src/utils/response'

import { ErrorCode } from 'zjf-types'
import { objectPick } from '@catsjuice/utils'
import type { User } from '../../entities/user'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly _jwtSrv: JwtService,
    private readonly _cfgSrv: ConfigService,
    private readonly _redisSrv: RedisService,
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
    }
    catch (err) {
      responseError(ErrorCode.AUTH_LOGIN_EXPIRED)
    }
    client.del(token)
    return true
  }
}
