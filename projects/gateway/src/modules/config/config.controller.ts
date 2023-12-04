import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import { PermissionType } from 'zjf-types'
import type { Config } from 'src/entities/config'

import { SysConfigService } from './config.service'
import { ConfigResDto } from './dto/config.res.dto'
import { UpsertConfigBodyDto } from './dto/upsert-config.body.dto'
import { VersionDto } from './dto/version.dto'

@ApiTags('Config | 全局配置')
@Controller('config')
export class ConfigController {
  constructor(
    private readonly _sysCfgSrv: SysConfigService,
  ) {}

  @ApiOperation({ summary: '获取指定全局配置' })
  @ApiSuccessResponse(ConfigResDto)
  @Get(':version')
  public async getConfig(@Param() param: VersionDto) {
    return await this._sysCfgSrv.getConfig(param.version)
  }

  @ApiOperation({
    summary: '创建/更新全局配置',
    description: '配置版本为唯一标识，如果存在，则会更新配置内容',
  })
  @HasPermission([PermissionType.EXPORT_LG_QUERY_ALL, PermissionType.EXPORT_SM_QUERY_ALL], 'AND')
  @Post()
  public async upsertConfig(@Body() body: UpsertConfigBodyDto) {
    const { version, ...config } = body
    const obj: Config = {
      version,
      config: {
        export: config,
      },
    }
    return await this._sysCfgSrv.repo().save(obj)
  }
}
