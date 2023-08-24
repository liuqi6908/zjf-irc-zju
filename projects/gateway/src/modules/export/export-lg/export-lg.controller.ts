import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { ErrorCode, PermissionType } from 'zjf-types'
import { HasPermission } from 'src/guards/permission.guard'
import { FileService } from 'src/modules/file/file.service'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Put, Req, Res, StreamableFile } from '@nestjs/common'
import type { FileExportLarge } from 'src/entities/export/file-export-large.entity'

import { ExportService } from '../export.service'
import { ExportFileBodyDto } from '../dto/export-file.body.dto'

@ApiTags('ExportLg | 大文件外发')
@Controller('export-lg')
export class ExportLgController {
  constructor(
    private readonly _exportSrv: ExportService,
    private readonly _fileSrv: FileService,
  ) {}

  @ApiOperation({ summary: '发起大文件外发的申请' })
  @IsLogin()
  @ApiBody({ type: ExportFileBodyDto })
  @ApiFormData('file', { note: { type: 'string', description: '备注信息' } })
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
    const note = body.note.value

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

  @ApiOperation({ summary: '通过一个大文件外发申请' })
  @HasPermission(PermissionType.EXPORT_LG_APPROVE)
  @ApiParam({ name: 'id', description: '大文件外发记录的唯一标识' })
  @Post('approve/:id')
  public async approve(@Param('id') id: string, @Req() req: FastifyRequest) {
    return await this._exportSrv.approveLarge(id, req.raw.user!)
  }

  @ApiOperation({ summary: '驳回一个大文件外发申请' })
  @HasPermission(PermissionType.EXPORT_LG_REJECT)
  @ApiParam({ name: 'id', description: '大文件外发记录的唯一标识' })
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string', description: '驳回理由' } } } })
  @Post('reject/:id')
  public async reject(@Param('id') id: string, @Req() req: FastifyRequest, @Body('reason') reason: string) {
    return await this._exportSrv.rejectLarge(id, req.raw.user!, reason)
  }

  @ApiOperation({ summary: '下载大文件外发的附件' })
  @HasPermission(PermissionType.EXPORT_LG_DOWNLOAD)
  @ApiParam({ name: 'id', description: '大文件外发记录的唯一标识' })
  @Get('file/:id')
  public async downloadExportLgFile(
    @Res({ passthrough: true }) res: any,
    @Param('id') id: string) {
    const feLg = await this._exportSrv.lgRepo().findOne({ where: { id } })
    if (!feLg)
      responseError(ErrorCode.EXPORT_NOT_EXISTS)
    const readable = await this._fileSrv.download('pri', feLg.path)
    res.header('Content-Disposition', `attachment; filename=${feLg.fileName}`)
    res.header('Content-Type', 'application/octet-stream')
    return new StreamableFile(readable)
  }
}
