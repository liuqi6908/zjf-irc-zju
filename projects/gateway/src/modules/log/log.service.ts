import { Queue } from 'bull'
import { ErrorCode } from 'zjf-types'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { objectPick } from '@catsjuice/utils'
import { ConfigService } from '@nestjs/config'
import type { OnModuleInit } from '@nestjs/common'
import { responseError } from 'src/utils/response'
import type { ESConfig } from 'src/config/_es.config'
import { formatTimeLabel } from 'src/utils/format-time-label'

import { EsAnalyzerService } from '../es-analyzer/es-analyzer.service'
import { logDataMapping } from '../../config/mapping/log-data.mapping'
import { dimensions } from './config/dimension'

export type LogDataAction = 'data:preview' | 'data:download'
const logActions: Record<LogDataAction, string> = {
  'data:preview': '预览数据',
  'data:download': '下载数据',
}

export type LogTarget = 'data'
const logTargets: Record<LogTarget, string> = {
  data: '数据',
}

export interface DataLog {
  user?: Partial<User>
  action: LogDataAction
  ip: string
  status: number
  target: {
    rootId: string
    dbId: string
    subDbId: string
    moduleId: string
    tableId: string
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
    const mapping = logDataMapping
    client.indices.exists({ index }).then((res: any) => {
      const body = res.body
      if (!body)
        client.indices.create({ index, body: { mappings: mapping } })
    },
    )
  }

  /**
   * 记录日志
   * @param log
   * @returns
   */
  public async doLog(log: DataLog) {
    const client = this._esAnalyzerSrv.getClient()
    const index = this._cfgSrv.get<ESConfig>('es').index.log
    return client.index({ index, body: log })
  }

  /**
   * 创建一个日志任务
   * @param log
   * @returns
   */
  public async log(log: DataLog) {
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

  /**
   * 获取全部的日志操作
   * @returns
   */
  public async getLogActions() {
    return Object.entries(logActions).map(([key, value]) => ({ key, value }))
  }

  /**
   * 获取全部的目标对象
   * @returns
   */
  public async getLogTargets() {
    return Object.entries(logTargets).map(([key, value]) => ({ key, value }))
  }

  public async agg(dimensionId: string, filterDsl?: string) {
    const query = filterDsl
      ? this._esAnalyzerSrv.dsl2query(filterDsl, logDataMapping)
      : undefined
    const dimension = dimensions.find(d => d.id === dimensionId)
    if (!dimension)
      responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
    const client = this._esAnalyzerSrv.getClient()
    const index = this._cfgSrv.get<ESConfig>('es').index.log
    const aggs = {}
    if (dimension.type === 'date') {
      aggs[dimensionId] = {
        date_histogram: {
          field: dimension.field,
          calendar_interval: dimension.interval,
        },
      }
    }
    else if (dimension.type === 'keyword') {
      if (dimension.field.includes('.')) {
        const [nestedField] = dimension.field.split('.')
        aggs[dimensionId] = {
          nested: {
            path: nestedField,
          },
          aggs: {
            [dimensionId]: {
              terms: {
                field: dimension.field,
              },
            },
          },
        }
      }
      else {
        aggs[dimensionId] = {
          terms: {
            field: `${dimension.field}.keyword`,
          },
        }
      }
    }
    const body = { _source: false, query, aggs }
    const esRes = await client.search({ body, index })

    let aggRes = esRes.body.aggregations[dimensionId]
    if (dimension.field.includes('.'))
      aggRes = aggRes[dimensionId]

    // return aggRes

    return aggRes.buckets.map((bucket) => {
      if (dimension.type === 'date') {
        return {
          key: formatTimeLabel(bucket.key_as_string, dimension.interval),
          value: bucket.doc_count,
        }
      }
      else if (dimension.type === 'keyword') {
        return {
          key: bucket.key,
          value: bucket.doc_count,
        }
      }
      return null
    })
  }
}
