import { ConfigService } from '@nestjs/config'
import { SuccessDto } from 'src/dto/success.dto'
import type { ESConfig } from 'src/config/_es.config'
import { ApiSuccessResponse } from 'src/utils/response'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { logDataMapping } from 'src/config/mapping/log-data.mapping'
import { HasLogAccess } from 'src/guards/log-access-permission.guard'

import { objectEntries } from '@catsjuice/utils'
import { DataService } from '../data/data.service'
import { EsAnalyzerService } from '../es-analyzer/es-analyzer.service'
import { LogService } from './log.service'
import { AggLogBodyDto } from './dto/agg-log.body.dto'
import { QueryByDslBodyDto } from './dto/query-by-dsl.body.dto'
import { DailyCountService } from './daily-count/daily-count.service'
import { GetAccessLast7DaysResDto } from './dto/access/get-access-last-7-days.res.dto'

@HasLogAccess()
@ApiTags('Log | 日志服务')
@Controller('log')
export class LogController {
  constructor(
    private readonly _logSrv: LogService,
    private readonly _cfgSrv: ConfigService,
    private readonly _esAnalyzerSrv: EsAnalyzerService,
    private readonly _dailyCountSrv: DailyCountService,
    private readonly _dataDirSrv: DataService,
  ) {}

  @ApiOperation({ summary: '获取当前的日志索引 mapping 信息' })
  @Get('data/_mapping')
  public getMapping() {
    return logDataMapping
  }

  @ApiOperation({ summary: '获取全部的可用行为' })
  @Get('data/_actions')
  public getActions() {
    return this._logSrv.getLogActions()
  }

  @ApiOperation({ summary: '获取全部的操作对象' })
  @Get('data/_targets')
  public getTargets() {
    return this._logSrv.getLogTargets()
  }

  @ApiOperation({ summary: '代理查询 ElasticSearch' })
  @ApiBody({ type: Object })
  @Post('data/_proxy')
  public async esProxyQuery(@Body() body: any) {
    return await this._esAnalyzerSrv.proxyQuery(
      this._cfgSrv.get<ESConfig>('es').index.log,
      body,
    )
  }

  @ApiOperation({ summary: '日志原始数据查询' })
  @Post('data/query/dsl')
  public async queryByDsl(@Body() body: QueryByDslBodyDto) {
    const { dsl, fields, page, pageSize } = body
    const res = await this._esAnalyzerSrv.queryByDsl(
      dsl,
      { page, pageSize },
      {
        fields,
        index: this._cfgSrv.get<ESConfig>('es').index.log,
        mapping: logDataMapping,
      },
    )
    const cachedMap = new Map()
    for (const element of res.records) {
      element.targetInfo = {}
      for (const [k, v] of objectEntries(element.target)) {
        const key = String(k).replace(/Id$/, '')
        const id = String(v)

        const imMemCache = cachedMap.get(key)
        if (imMemCache) {
          element.targetInfo[key] = imMemCache
          continue
        }
        const cache = await this._dataDirSrv.getDirCache(id)
        if (!cache)
          continue
        cachedMap.set(key, cache)
        element.targetInfo[key] = cache
      }
    }
    return res
  }

  @ApiOperation({ summary: '日志聚合分析' })
  @Post('data/agg')
  public async agg(@Body() body: AggLogBodyDto) {
    const { dimension, dsl, size } = body
    return await this._logSrv.agg(dimension, dsl, size)
  }

  @ApiOperation({ summary: '获取最近 7 天的访问量' })
  @Get('access/last7days')
  @ApiSuccessResponse(GetAccessLast7DaysResDto)
  public async getAccessLast7Days() {
    return await this._dailyCountSrv.getAccessLast7Days()
  }

  @ApiOperation({ summary: '获取当日的访问量' })
  @Get('access/today')
  @ApiSuccessResponse(SuccessDto<number>)
  public async getAccessToday() {
    return await this._dailyCountSrv.getAccessToday()
  }

  @ApiOperation({ summary: '获取访问总量' })
  @Get('access/total')
  @ApiSuccessResponse(SuccessDto<number>)
  public async getAccessTotal() {
    return await this._dailyCountSrv.getAccessTotal()
  }
}
