import { ErrorCode } from 'zjf-types'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Param, Patch, Put, Req } from '@nestjs/common'
import { ApiFormData } from 'src/decorators/api/api-form-data'

import { WorkService } from './work.service'

@ApiTags('Work | 成果（作品）模块')
@Controller('work')
export class WorkController {
  constructor(private readonly _workSrv: WorkService) {}

  @ApiOperation({ summary: '上传作品' })
  @ApiFormData('file', {
    title: { type: 'string', description: '作品题目' },
    author: { type: 'string', description: '作者' },
  })
  @IsLogin()
  @Put()
  public async upload(@Body() body: any, @Req() req: FastifyRequest) {
    const buffer = await body?.file?.toBuffer()
    if (!buffer)
      responseError(ErrorCode.FILE_NOT_FOUND)

    const fileSize = buffer.byteLength
    if (fileSize > 1024 * 1024 * 10)
      responseError(ErrorCode.FILE_TOO_LARGE)
    const filename = body.file.filename
    if (!filename.split('.').pop().match(/pdf/i))
      responseError(ErrorCode.FILE_TYPE_NOT_ALLOWED, '仅支持 PDF 格式')

    const title = body.title?.value
    const author = body.author?.value

    return await this._workSrv.upload({
      user: req.raw.user,
      file: buffer,
      title,
      author,
      filename,
    })
  }

  @ApiOperation({ summary: '更新已上传的作品' })
  @ApiParam({ name: 'id', description: '上传记录的唯一标识' })
  @ApiFormData('file', {
    title: { type: 'string', description: '作品题目' },
    author: { type: 'string', description: '作者' },
  })
  @IsLogin()
  @Patch(':id')
  public async update(
    @Body() body: any,
    @Req() req: FastifyRequest,
    @Param('id') id: string,
  ) {
    const user = req.raw.user
    const record = await this._workSrv.repo().findOne({ where: { id } })
    if (!record)
      responseError(ErrorCode.FILE_NOT_FOUND, '该作品已被删除')
    if (user.id !== record.userId)
      responseError(ErrorCode.PERMISSION_DENIED, '无权修改他人的作品')

    const buffer = await body?.file?.toBuffer()
    const title = body.title?.value
    const author = body.author?.value

    let filename

    if (buffer) {
      const fileSize = buffer.byteLength
      if (fileSize > 1024 * 1024 * 10)
        responseError(ErrorCode.FILE_TOO_LARGE)
      filename = body.file.filename
      if (!filename.split('.').pop().match(/pdf/i))
        responseError(ErrorCode.FILE_TYPE_NOT_ALLOWED, '仅支持 PDF 格式')
    }

    return await this._workSrv.update({ record, file: buffer, filename, title, author })
  }
}
