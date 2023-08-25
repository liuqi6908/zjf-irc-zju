import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import type { Work } from 'src/entities/work'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { ErrorCode, PermissionType } from 'zjf-types'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Res, StreamableFile } from '@nestjs/common'

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

    let title = body.title?.value
    const author = body.author?.value

    if (!title)
      title = filename.split('.').shift()

    if (!author) {
      responseParamsError([{
        property: 'author',
        constraints: { author: '作者不能为空' },
      }])
    }

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

  @ApiOperation({ summary: '删除已上传的作品' })
  @ApiParam({ name: 'id', description: '上传记录的唯一标识' })
  @IsLogin()
  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user
    const record = await this._workSrv.repo().findOne({ where: { id } })
    if (!record)
      responseError(ErrorCode.FILE_NOT_FOUND, '该作品已被删除')
    if (user.id !== record.userId)
      responseError(ErrorCode.PERMISSION_DENIED, '无权删除他人的作品')

    return await this._workSrv.delete(record)
  }

  @ApiOperation({ summary: '查询自己的作品列表' })
  @IsLogin()
  @Post('query/own')
  public async queryOwnWorks(
    @Req() req: FastifyRequest,
    @Body() body: QueryDto<Work>,
  ) {
    const user = req.raw.user!
    body = body ?? {}
    body.filters = [...(body?.filters || [])].filter(cfg => cfg.field !== 'userId')
    body.filters.push({ field: 'userId', type: '=', value: user.id })
    return await getQuery(this._workSrv.repo(), body || {})
  }

  @ApiOperation({ summary: '查询所有的作品列表' })
  @HasPermission(PermissionType.WORK_QUERY_ALL)
  @IsLogin()
  @Post('query')
  public async query(@Body() body: QueryDto<Work>) {
    return await getQuery(this._workSrv.repo(), body || {})
  }

  @ApiOperation({ summary: '下载指定作品的附件' })
  @ApiParam({ name: 'id', description: '上传记录的唯一标识' })
  @HasPermission(PermissionType.WORK_DOWNLOAD)
  @Get('file/:id')
  public async downloadFile(
    @Res({ passthrough: true }) res: any,
    @Param('id') id: string,
  ) {
    const { stream, filename } = await this._workSrv.download(id)
    res.header('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`)
    return new StreamableFile(stream)
  }
}
