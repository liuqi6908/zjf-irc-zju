import { ErrorCode } from 'zjf-types'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { Body, Controller, Put, Req } from '@nestjs/common'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

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
}
