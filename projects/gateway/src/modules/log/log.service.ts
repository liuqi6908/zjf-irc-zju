import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { objectPick } from '@catsjuice/utils'
import { ConfigService } from '@nestjs/config'
import type { OnModuleInit } from '@nestjs/common'
import type { ESConfig } from 'src/config/_es.config'

import { EsAnalyzerService } from '../es-analyzer/es-analyzer.service'

export type LogAction = 'data:preview' | 'data:download'
const logActions: Record<LogAction, string> = {
  'data:preview': '预览数据',
  'data:download': '下载数据',
}

export type LogTarget = 'data'
const logTargets: Record<LogTarget, string> = {
  data: '数据',
}

export interface Log {
  user: Partial<User>
  action: LogAction
  ip: string
  success: number
  targetType: LogTarget
  target: {
    id: string
    name: string
  }
  time: Date
}

@Injectable()
export class LogService implements OnModuleInit {
  constructor(
    @InjectQueue('log')
    private readonly _logQueue: Queue,
    private readonly _cfgSrv: ConfigService,
    private readonly _esAnalyzerSrv: EsAnalyzerService,
  ) {}

  onModuleInit() {
    const client = this._esAnalyzerSrv.getClient()
    const index = this._cfgSrv.get<ESConfig>('es').index.log
    client.indices.exists({ index }).then((res: any) => {
      const body = res.body
      if (!body)
        client.indices.create({ index })
    },
    )
  }

  public async doLog(log: Log) {
    const client = this._esAnalyzerSrv.getClient()
    const index = this._cfgSrv.get<ESConfig>('es').index.log
    return client.index({ index, body: log })
  }

  public async log(log: Log) {
    const saveLog = {
      ...log,
      user: log.user
        ? {
            ...objectPick(log.user, ['id', 'email', 'nickname', 'account']),
            verification: log.user.verification
              ? {
                  ...objectPick(log.user.verification, ['name', 'college', 'idCard', 'identify', 'number', 'school']),
                }
              : null,
          }
        : null,
    }
    return await this._logQueue.add('record', saveLog)
  }

  public async getLogActions() {
    return Object.entries(logActions).map(([key, value]) => ({ key, value }))
  }

  public async getLogTargets() {
    return Object.entries(logTargets).map(([key, value]) => ({ key, value }))
  }
}
