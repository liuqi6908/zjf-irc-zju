import { Injectable } from '@nestjs/common'
import type { CodeAction } from 'zjf-types'
import { ConfigService } from '@nestjs/config'
import { randomString } from '@catsjuice/utils'

import { RedisService } from '../redis/redis.service'

@Injectable()
export class CodeService {
  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _redisSrv: RedisService,
  ) {}

  /**
   * 创建一个验证码并存入 redis
   * @param platformId
   * @param action
   * @param expireInMinutes
   * @returns
   */
  public async createCode(
    platformId: string,
    action: CodeAction,
    expireInMinutes = 5,
  ) {
    const code = Math.random().toString().slice(-6)
    const bizId = randomString(24, 24, '') + Date.now().toString(36)
    // save code to redis
    const client = await this._redisSrv.getClient(RedisType.CODE)
    await client.setEx(bizId, expireInMinutes * 60, JSON.stringify([
      platformId,
      action,
      code,
    ]))
    return { code, bizId }
  }

  /**
   * 校验一个验证码是否正确
   * @param bizId
   * @param compareInfo
   * @param deleteAfterVerify
   */
  public async verifyCode(
    bizId: string,
    compareInfo: [string, CodeAction, string],
    deleteAfterVerify = true,
  ) {
    const client = await this._redisSrv.getClient(RedisType.CODE)
    const codeInfo = await client.get(bizId)
    if (!codeInfo)
      return false
    const codeInfoArr = JSON.parse(codeInfo) as [string, CodeAction, string]
    if (codeInfoArr.some((v, i) => v !== compareInfo[i]))
      return false
    if (deleteAfterVerify)
      client.del(bizId)
    return true
  }
}
