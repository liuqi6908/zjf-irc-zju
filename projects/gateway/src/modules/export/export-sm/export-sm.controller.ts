import { IsLogin } from 'src/guards/login.guard'
import { Body, Controller, Put, Req } from '@nestjs/common'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { responseError } from 'src/utils/response'
import { ErrorCode } from 'zjf-types'
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
}
