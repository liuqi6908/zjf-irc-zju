import * as Papa from 'papaparse'
import { PermissionType } from 'zjf-types'
import { batchSave } from 'src/utils/db/batch-save'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { dataCsvParser } from 'src/utils/parser/data-csv-parser'
import { Body, Controller, Logger, Param, Put, Query } from '@nestjs/common'

import { IsNull, Not } from 'typeorm'
import { DataService } from './data.service'
import { UploadDirectoryQueryDto } from './dto/upload-directory.query.dto'

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
}
