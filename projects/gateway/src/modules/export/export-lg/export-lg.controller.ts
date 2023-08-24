import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { ErrorCode, PermissionType } from 'zjf-types'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Put, Req } from '@nestjs/common'
import type { FileExportLarge } from 'src/entities/export/file-export-large.entity'

import { ExportService } from '../export.service'
import { ExportFileBodyDto } from '../dto/export-file.body.dto'

@ApiTags('ExportLg | 大文件外发')
@Controller('export-lg')
export class ExportLgController {
  constructor(
    private readonly _exportSrv: ExportService,
  ) {}

  @ApiOperation({
    summary: '发起大文件外发的申请',
    description: '备注信息放 `body.note`（Swagger 有冲突文档无法显示）',
  })
  @IsLogin()
  @ApiBody({ type: ExportFileBodyDto })
  @ApiFormData()
  @Put()
  public async postExportLg(@Body() body: any, @Req() req: FastifyRequest) {
    const buffer = await body?.file?.toBuffer()
    if (!buffer)
      responseError(ErrorCode.EXPORT_FILE_NOT_EXISTS)

    const fileSize = buffer.length
    const filename = body?.file?.filename
    const contentType = body?.file?.mimetype
    const user = req.raw.user!
    const ip = req.raw.ip
    const note = body.note

    return await this._exportSrv.exportLarge({
      user,
      ip,
      filename,
      fileSize,
      note,
      buffer,
      contentType,
    })
  }

  @ApiOperation({ summary: '查询全部的大文件外发记录' })
  @HasPermission(PermissionType.EXPORT_LG_QUERY_ALL)
  @Post('query')
  public async queryAll(@Body() body: QueryDto<FileExportLarge>) {
    return await getQuery(this._exportSrv.lgRepo(), body || {})
  }

  @ApiOperation({ summary: '查询自己的大文件外发历史记录' })
  @IsLogin()
  @Post('query/own')
  public async queryOwn(
    @Body() body: QueryDto<FileExportLarge>,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    body = body ?? {}
    body.filters = [...(body?.filters || [])].filter(cfg => cfg.field !== 'founderId')
    body.filters.push({ field: 'founderId', type: '=', value: user.id })
    return await getQuery(this._exportSrv.lgRepo(), body)
  }
}
