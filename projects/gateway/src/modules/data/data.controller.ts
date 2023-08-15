import * as Papa from 'papaparse'
import type { FindOptionsWhere } from 'typeorm'
import { In, IsNull, Not } from 'typeorm'
import { PermissionType } from 'zjf-types'
import { objectKeys } from '@catsjuice/utils'
import { batchSave } from 'src/utils/db/batch-save'
import { ApiSuccessResponse } from 'src/utils/response'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { dataCsvParser } from 'src/utils/parser/data-csv-parser'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Logger, Param, Patch, Put, Query, Req } from '@nestjs/common'

import type { DataDirectory } from 'src/entities/data-directory'
import { createDataDirectoryTree } from 'src/utils/data-directory-tree'
import { DataService } from './data.service'
import { GetDataListResDto } from './dto/get-data-list.res.dto'
import { UpdateReferenceBodyDto } from './dto/update-reference.body.dto'
import { UploadDirectoryQueryDto } from './dto/upload-directory.query.dto'
import { DataPermissionService, visitorRole } from './data-permission/data-permission.service'

@ApiTags('Data | 数据服务')
@Controller('data')
export class DataController {
  private readonly _logger = new Logger(DataController.name)
  constructor(
    private readonly _dataSrv: DataService,
    private readonly _dataPSrv: DataPermissionService) {}

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
  @HasPermission([], undefined, false)
  @Get('list/root')
  public async getRoots(@Req() req: FastifyRequest) {
    const user = req.raw.user
    const roots = await this._dataSrv.dirRepo().find({
      where: { parentId: IsNull() },
    })
    const dataRoleName = user?.dataRoleName || visitorRole.name
    const permissions = user?.role?.permissions || []
    const allowedScopes = permissions.some(p => p.name === PermissionType.DATA_QUERY_ALL)
      ? roots.map(r => r.id)
      : (await this._dataPSrv.dataRoleRepo()
          .findOne({
            where: { name: dataRoleName },
            relations: { viewDirectories: true },
          })
        )
          .viewDirectories
          .map(d => d.rootId)
    return createDataDirectoryTree(roots, allowedScopes)
  }

  @ApiOperation({ summary: '获取指定分类的数据' })
  @ApiSuccessResponse(GetDataListResDto)
  @HasPermission([], undefined, false)
  @Get('list/:dataRootId')
  public async getListOfDataRoot(
    @Param() param: DataRootIdDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user

    const data = await this._dataSrv.dirRepo().find({
      where: { rootId: param.dataRootId },
    })
    const nodes = data.map((row) => {
      objectKeys(row).forEach((key) => {
        if (row[key] === null || row[key] === undefined)
          delete row[key]
      })
      return row
    })

    const dataRoleName = user?.dataRoleName || visitorRole.name
    const permissions = user?.role?.permissions || []
    const allowedScopes = permissions.some(p => p.name === PermissionType.DATA_QUERY_ALL)
      ? [param.dataRootId]
      : (await this._dataPSrv.dataRoleRepo()
          .findOne({
            where: { name: dataRoleName },
            relations: { viewDirectories: true },
          })
        )
          .viewDirectories
          .map(d => d.id)
    return createDataDirectoryTree(nodes, allowedScopes)
  }

  @ApiOperation({ summary: '更新引用规范' })
  @ApiParam({ name: 'dataDirectoryId', description: '数据目录的唯一标识' })
  @Patch('reference/:dataDirectoryId')
  public async updateReference(
    @Param('dataDirectoryId') dataDirectoryId: string,
    @Body() body: UpdateReferenceBodyDto,
  ) {
    await this._dataSrv.dirRepo().update(dataDirectoryId, {
      reference: body.reference,
    })
    return true
  }
}
