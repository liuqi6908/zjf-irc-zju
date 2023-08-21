import { ModuleRef } from '@nestjs/core'
import { Injectable } from '@nestjs/common'
import type { NestMiddleware } from '@nestjs/common'
import { DailyCountService } from 'src/modules/log/daily-count/daily-count.service'

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(private readonly _modRef: ModuleRef) {}

  use(req, res, next) {
    const dailyCountSrv = this._modRef.get(DailyCountService, { strict: false })
    dailyCountSrv.recordAccess()
    next()
  }
}
