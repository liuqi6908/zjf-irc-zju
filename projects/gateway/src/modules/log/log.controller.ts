import { ConfigService } from '@nestjs/config'
import type { ESConfig } from 'src/config/_es.config'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { logDataMapping } from 'src/config/mapping/log-data.mapping'

import { ApiSuccessResponse } from 'src/utils/response'
import { SuccessDto } from 'src/dto/success.dto'
import { EsAnalyzerService } from '../es-analyzer/es-analyzer.service'
import { LogService } from './log.service'
import { AggLogBodyDto } from './dto/agg-log.body.dto'
import { QueryByDslBodyDto } from './dto/query-by-dsl.body.dto'
import { DailyCountService } from './daily-count/daily-count.service'
import { GetAccessLast7DaysResDto } from './dto/access/get-access-last-7-days.res.dto'

@ApiTags('Log | 日志服务')
@Controller('log')
export class LogController {
  constructor(
    private readonly _logSrv: LogService,
    private readonly _cfgSrv: ConfigService,
    private readonly _esAnalyzerSrv: EsAnalyzerService,
    private readonly _dailyCountSrv: DailyCountService,
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
    return await this._esAnalyzerSrv.queryByDsl(
      dsl,
      { page, pageSize },
      {
        fields,
        index: this._cfgSrv.get<ESConfig>('es').index.log,
        mapping: logDataMapping,
      },
    )
  }

  @ApiOperation({ summary: '日志聚合分析' })
  @Post('data/agg')
  public async agg(@Body() body: AggLogBodyDto) {
    const { dimension, dsl } = body
    return await this._logSrv.agg(dimension, dsl)
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
