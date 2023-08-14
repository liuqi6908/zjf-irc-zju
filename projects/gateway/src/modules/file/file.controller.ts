import { IsLogin } from 'src/guards/login.guard'
import { FilenameDto } from 'src/dto/filename.dto'
import { FilePathDto } from 'src/dto/file-path.dto'
import { ErrorCode, PermissionType } from 'zjf-types'
import { SuccessStringDto } from 'src/dto/success.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Put, Query, Req, Res, StreamableFile } from '@nestjs/common'

import { ApiFormData } from '../../decorators/api/api-form-data'
import { FileService } from './file.service'
import { GetVerifyAttachmentParamDto } from './dto/get-verify-attachment.param.dto'

@ApiTags('File | 文件服务')
@Controller('file')
export class FileController {
  constructor(
    private readonly _fileSrv: FileService,
  ) {}

  @ApiOperation({ summary: '上传公共文件' })
  @ApiFormData()
  @Put('public')
  public async uploadPublicFile(
    @Query() query: FilePathDto,
    @Body() body: any,
  ) {
    await this._fileSrv.upload('pub', query.path, await body?.file?.toBuffer())
    return query.path
  }

  @ApiOperation({ summary: '获取（下载）公共文件' })
  @Get('public')
  public async getFile(
    @Query() query: FilePathDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<StreamableFile> {
    const file = await this._fileSrv.download('pub', query.path)
    const filename = query.path.split('/').pop()
    const ext = filename.split('.').pop()
    res.header('Content-Disposition', `attachment; filename=${filename}`)
    res.header('Content-Type', `application/${ext}`)
    return new StreamableFile(file)
  }

  @ApiOperation({
    summary: '上传认证素材',
    description: '上传成功后会返回最终存储的文件名，用于放入创建认证的接口的 `attachments` 中',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @IsLogin()
  @ApiFormData()
  @Put('private/verify/:filename')
  public async uploadVerifyAttachments(
    @Param() param: FilenameDto,
    @Req() req: FastifyRequest,
      @Body() body: any,
  ) {
    const user = req.raw.user!
    const buffer = await body?.file?.toBuffer()
    const filename = param.filename
    const arr = filename.split('.')
    const ext = arr.pop()
    const name = arr.join('.')
    const saveFilename = `${name}_${Date.now()}.${ext}`
    const path = `verify/${user.id}/${saveFilename}`
    await this._fileSrv.upload('pri', path, buffer)
    return saveFilename
  }

  @ApiOperation({ summary: '获取（下载）指定用户上传的认证素材' })
  @IsLogin()
  @HasPermission()
  @Get('private/verify/:userId/:filename')
  public async getVerifyAttachments(
    @Req() req: FastifyRequest,
    @Param() param: GetVerifyAttachmentParamDto,
  ): Promise<StreamableFile> {
    const user = req.raw.user!
    const permissions = user?.role?.permissions || []
    const allowed = param.userId === user.id || permissions.some(p => p.name === PermissionType.VERIFICATION_CAT_ATTACHMENT)
    if (!allowed)
      responseError(ErrorCode.PERMISSION_DENIED)

    const path = `verify/${param.userId}/${param.filename}`
    return new StreamableFile(await this._fileSrv.download('pri', path))
  }
}
