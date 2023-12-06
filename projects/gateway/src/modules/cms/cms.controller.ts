import { PermissionType } from 'zjf-types'
import { CmsIdDto } from 'src/dto/id/cms.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'

import { CmsService } from './cms.service'
import { CmsResDto } from './dto/get-cms.res.dto'
import { UpsertCmsBodyDto } from './dto/upsert.body.dto'

@ApiTags('CMS | 内容管理服务')
@Controller('cms')
export class CmsController {
  constructor(
    private readonly _cmsSrv: CmsService<any>,
  ) {}

  @ApiOperation({ summary: '创建或更新内容' })
  @ApiSuccessResponse(CmsResDto)
  @HasPermission([PermissionType.CMS_CREATE, PermissionType.CMS_UPDATE], 'AND')
  @Post('upsert/:cmsId')
  public async upsert(
    @Body() body: UpsertCmsBodyDto<any>,
    @Param() param: CmsIdDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user
    return await this._cmsSrv.upsert(param.cmsId, body, user)
  }

  @ApiOperation({ summary: '获取内容' })
  @ApiSuccessResponse(CmsResDto)
  @Get(':cmsId')
  public async getCms(@Param() param: CmsIdDto) {
    return await this._cmsSrv.findOne(param.cmsId)
  }
}
