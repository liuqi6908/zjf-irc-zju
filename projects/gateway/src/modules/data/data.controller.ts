import * as Papa from 'papaparse'
import { IsNull, Not } from 'typeorm'
import { PermissionType } from 'zjf-types'
import { batchSave } from 'src/utils/db/batch-save'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { dataCsvParser } from 'src/utils/parser/data-csv-parser'
import { Body, Controller, Get, Logger, Param, Patch, Put, Query } from '@nestjs/common'

import { objectKeys } from '@catsjuice/utils'
import { DataService } from './data.service'
import { GetDataListResDto } from './dto/get-data-list.res.dto'
import { UploadDirectoryQueryDto } from './dto/upload-directory.query.dto'
import { UpdateReferenceBodyDto } from './dto/update-reference.body.dto'

@ApiTags('Data | 数据服务')
@Controller('data')
export class DataController {
  private readonly _logger = new Logger(DataController.name)
  constructor(private readonly _dataSrv: DataService) {}

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

    const logger = console;

    (async () => {
      if (query.clear) {
        await this._dataSrv.dirRepo().delete({
          rootId: param.dataRootId,
          parentId: Not(IsNull()),
        })
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

  // TODO: 数据使用权限校验
  @ApiOperation({ summary: '获取指定分类的数据' })
  @ApiSuccessResponse(GetDataListResDto)
  @Get('list/:dataRootId')
  public async getListOfDataRoot(
    @Param() param: DataRootIdDto,
  ) {
    const data = await this._dataSrv.dirRepo().find({
      where: { rootId: param.dataRootId },
    })
    return data.map((row) => {
      objectKeys(row).forEach((key) => {
        if (row[key] === null || row[key] === undefined)
          delete row[key]
      })
      return row
    })
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
