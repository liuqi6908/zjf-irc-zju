import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'

import { SysConfigService } from './config.service'
import { ConfigResDto } from './dto/config.res.dto'

@ApiTags('Config | 全局配置')
@Controller('config')
export class ConfigController {
  constructor(
    private readonly _sysCfgSrv: SysConfigService,
  ) {}

  @ApiOperation({ summary: '获取全局配置' })
  @ApiSuccessResponse(ConfigResDto)
  @Get()
  public async getConfig() {
    return (await this._sysCfgSrv.repo().findOne({
      where: {},
      select: ['config'],
    }))?.config
  }
}
