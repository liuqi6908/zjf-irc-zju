import { Job } from 'bull'
import { Injectable } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'

import { LogService } from './log.service'

import type { DataLog } from './log.service'

@Injectable()
@Processor('log')
export class LogConsumer {
  constructor(private readonly _logSrv: LogService) {}

  @Process('record')
  async record(job: Job<DataLog>) {
    const log = job.data
    await this._logSrv.doLog(log)
  }
}
