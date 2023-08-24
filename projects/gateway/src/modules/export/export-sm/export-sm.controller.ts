import { ErrorCode } from 'zjf-types'
import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Put, Req } from '@nestjs/common'
import type { FileExportSmall } from 'src/entities/export/file-export-small.entity'

import { ExportService } from '../export.service'
import { ExportFileBodyDto } from '../dto/export-file.body.dto'

@ApiTags('ExportSm | 小文件外发')
@Controller('export-sm')
export class ExportSmController {
  constructor(
    private readonly _exportSrv: ExportService,
  ) {}

  @ApiOperation({ summary: '小文件外发' })
  @IsLogin()
  @ApiBody({ type: ExportFileBodyDto })
  @ApiFormData()
  @Put()
  public async exportSmall(
    @Body() body: any,
    @Req() req: FastifyRequest,
  ) {
    const buffer = await body?.file?.toBuffer()
    if (!buffer)
      responseError(ErrorCode.EXPORT_FILE_NOT_EXISTS)
    const fileSize = buffer.length
    const filename = body?.file?.filename
    const contentType = body?.file?.mimetype
    const user = req.raw.user!
    const ip = req.raw.ip
    const note = body.note

    return await this._exportSrv.exportSmall({
      user,
      ip,
      filename,
      fileSize,
      note,
      buffer,
      contentType,
    })
  }

  @ApiOperation({ summary: '查询自己的小文件外发历史记录' })
  @IsLogin()
  @Post('query/own')
  public async queryOwnHistory(
    @Req() req: FastifyRequest,
    @Body() body: QueryDto<FileExportSmall>,
  ) {
    const user = req.raw.user!
    body = body ?? {}
    // 限制作用域
    body.filters = [...(body?.filters || [])].filter(cfg => cfg.field !== 'founderId')
    body.filters.push({ field: 'founderId', type: '=', value: user.id })
    return await getQuery(this._exportSrv.smRepo(), body || {})
  }
}
