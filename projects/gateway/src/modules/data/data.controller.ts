import { Buffer } from 'node:buffer'
import * as Papa from 'papaparse'
import { In, IsNull, Not } from 'typeorm'
import type { FindOptionsWhere } from 'typeorm'
import { batchSave } from 'src/utils/db/batch-save'
import { ErrorCode, PermissionType } from 'zjf-types'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { dataCsvParser } from 'src/utils/parser/data-csv-parser'
import type { DataDirectory } from 'src/entities/data-directory'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { DataRoleCheck } from 'src/guards/data-role-permission.guard'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { createDataDirectoryTree } from 'src/utils/data-directory-tree'
import { Body, Controller, Get, Logger, Param, Patch, Put, Query, Req } from '@nestjs/common'

import { FileService } from '../file/file.service'
import { DataService } from './data.service'
import { GetDataListResDto } from './dto/get-data-list.res.dto'
import { GetDataFieldListResDto } from './dto/get-field-list.res.dto'
import { UpdateReferenceBodyDto } from './dto/update-reference.body.dto'
import { UploadDirectoryQueryDto } from './dto/upload-directory.query.dto'
import { DataPermissionService } from './data-permission/data-permission.service'

@ApiTags('Data | 数据服务')
@Controller('data')
export class DataController {
  private readonly _logger = new Logger(DataController.name)
  constructor(
    private readonly _dataSrv: DataService,
    private readonly _fileSrv: FileService,
    private readonly _dataPSrv: DataPermissionService,

  ) {}

  @ApiOperation({ summary: '上传中间表' })
  @HasPermission(PermissionType.DATA_UPLOAD)
  @ApiFormData()
  @Put('upload/:dataRootId')
  public async uploadDirectory(
    @Query() query: UploadDirectoryQueryDto,
    @Param() param: DataRootIdDto,
    @Body() body: any,
  ) {
    const buffer = await body?.file?.toBuffer()
    const csv = Papa.parse(buffer.toString(), {
      header: true,
    }).data

    const { nodes, fields } = dataCsvParser(csv, param.dataRootId)

    const _ = console
    const logger = {
      log: (...msgs: any[]) => _.log('[上传中间表]', ...msgs),
      error: _.error,
    };

    (async () => {
      const newIds = nodes.map(node => node.id)
      if (query.clear) {
        const where: FindOptionsWhere<DataDirectory> = {
          rootId: param.dataRootId,
          parentId: Not(IsNull()),
          id: Not(In(newIds)),
        }
        const deleteCount = await this._dataSrv.dirRepo().count({ where })
        logger.log(`clear ${deleteCount} rows`)
        await this._dataSrv.dirRepo().delete(where)
        logger.log('clear success')
      }
      Promise.all([
        batchSave(this._dataSrv.dirRepo(), nodes),
        batchSave(this._dataSrv.fieldRepo(), fields),
      ])
        .then(() => logger.log('upload success'))
        .catch(logger.error)
    })()

    return {
      nodes: nodes.length,
      fields: fields.length,
    }
  }

  @ApiOperation({ summary: '获取所有的根节点（最大的分类）数据' })
  @ApiSuccessResponse(GetDataListResDto)
  @DataRoleCheck('viewDirectories')
  @Get('list/root')
  public async getRoots(@Req() req: FastifyRequest) {
    const roots = await this._dataSrv.dirRepo().find({
      where: { parentId: IsNull() },
    })
    const dataRole = req.dataRole
    const allowedScopes = dataRole === '*'
      ? roots.map(r => r.id)
      : dataRole
        .viewDirectories
        .map(d => d.rootId)
    return createDataDirectoryTree(roots, allowedScopes)
  }

  @ApiOperation({ summary: '获取指定分类的数据' })
  @ApiSuccessResponse(GetDataListResDto)
  @DataRoleCheck('viewDirectories')
  @Get('list/:dataRootId')
  public async getListOfDataRoot(
    @Param() param: DataRootIdDto,
    @Req() req: FastifyRequest,
  ) {
    const dataRole = req.dataRole
    const nodes = await this._dataSrv.dirRepo().find({
      where: { rootId: param.dataRootId },
    })

    const allowedScopes = dataRole === '*'
      ? [param.dataRootId]
      : dataRole
        .viewDirectories
        .map(d => d.id)
    return createDataDirectoryTree(nodes, allowedScopes)
  }

  @ApiOperation({ summary: '更新引用规范' })
  @HasPermission(PermissionType.DATA_PERMISSION_UPDATE_REFERENCE)
  @ApiParam({ name: 'dataDirectoryId', description: '数据目录的唯一标识' })
  @Patch('reference/:dataDirectoryId')
  public async updateReference(
    @Param('dataDirectoryId') dataDirectoryId: string,
    @Body() body: UpdateReferenceBodyDto,
  ) {
    await this._dataSrv.dirRepo().update(dataDirectoryId, { reference: body.reference })
    return true
  }

  @ApiOperation({ summary: '获取指定表格的字段说明' })
  @ApiSuccessResponse(GetDataFieldListResDto)
  @ApiParam({ name: 'dataDirectoryId', description: '数据目录的唯一标识（目前仅 level4 表格可用）' })
  @DataRoleCheck('viewDirectories')
  @Get('fields/:dataDirectoryId')
  public async getFields(
    @Param('dataDirectoryId') dataDirectoryId: string,
    @Req() req: FastifyRequest,
  ) {
    const dataRole = req.dataRole
    const directory = await this._dataSrv.dirRepo().findOne({ where: { id: dataDirectoryId } })
    if (!directory)
      responseError(ErrorCode.DATA_DIRECTORY_NOT_FOUND)

    const allowed = dataRole === '*' || dataRole.viewDirectories.some(d => directory.path.includes(d.id))
    if (!allowed)
      responseError(ErrorCode.PERMISSION_DENIED)

    return await this._dataSrv.fieldRepo().find({
      where: { directoryId: dataDirectoryId },
    })
  }

  @ApiOperation({ summary: '获取数据预览' })
  @DataRoleCheck('viewDirectories')
  @ApiParam({ name: 'dataDirectoryId', description: '数据目录的id（请注意，只能传表级别，其他级别没有意义，会直接报错）' })
  @Get('preview/:dataDirectoryId')
  public async previewData(
    @Param('dataDirectoryId') dataDirectoryId: string,
    @Req() req: FastifyRequest,
  ) {
    const dataRole = req.dataRole
    const dataDirectory = await this._dataSrv.dirRepo().findOne({ where: { id: dataDirectoryId } })
    const dataRootId = dataDirectory?.rootId
    if (!dataDirectory)
      responseError(ErrorCode.DATA_DIRECTORY_NOT_FOUND)
    if (dataDirectory.level !== 4)
      responseError(ErrorCode.DATA_TABLE_MANIPULATE_ONLY)
    const allowed = dataRole === '*' || dataRole.viewDirectories.some(p => dataDirectory.path.includes(p.id))
    if (!allowed)
      responseError(ErrorCode.PERMISSION_DENIED)
    const tableEn = dataDirectory.nameEN
    const path = `preview/${dataRootId}/${tableEn}.csv`
    const readable = await this._fileSrv.download('data', path)
    const buff = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => resolve(Buffer.concat(chunks)))
      readable.on('error', reject)
    })

    return Papa.parse(buff.toString(), { header: true }).data
  }

  @ApiOperation({ summary: '获取数据下载链接' })
  @DataRoleCheck('downloadDirectories')
  @ApiParam({ name: 'dataDirectoryId', description: '数据目录的id（请注意，只能传表级别，其他级别没有意义，会直接报错）' })
  @Get('download/link/:dataDirectoryId')
  public async getDownloadLink(
    @Param('dataDirectoryId') dataDirectoryId: string,
    @Req() req: FastifyRequest,
  ) {
    const dataRole = req.dataRole
    const dataDirectory = await this._dataSrv.dirRepo().findOne({ where: { id: dataDirectoryId } })
    const dataRootId = dataDirectory?.rootId
    if (!dataDirectory)
      responseError(ErrorCode.DATA_DIRECTORY_NOT_FOUND)
    if (dataDirectory.level !== 4)
      responseError(ErrorCode.DATA_TABLE_MANIPULATE_ONLY)
    const allowed = dataRole === '*' || dataRole.downloadDirectories.some(p => dataDirectory.path.includes(p.id))
    if (!allowed)
      responseError(ErrorCode.PERMISSION_DENIED)
    const tableEn = dataDirectory.nameEN
    const path = `download/${dataRootId}/${tableEn}.csv`
    return await this._fileSrv.signUrl('data', path)
  }
}
